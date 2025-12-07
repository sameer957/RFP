import Imap from "imap";
import { simpleParser } from "mailparser";
import prisma from "../config/db.js";
import { promisify } from "util";
import {
  produceReplyReceived,
  initKafkaProducer,
  shutdownProducer,
  produceActivityEvent,
} from "./kafka.js";

const imapConfig = {
  user: process.env.IMAP_USER || process.env.SMTP_USER,
  password: process.env.IMAP_PASS,
  host: process.env.IMAP_HOST,
  port: process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT) : 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

let imap;
let reconnectAttempts = 0;
const MAX_RECONNECT_DELAY = 60 * 1000;

function openInbox(cb) {
  imap.openBox("INBOX", false, cb);
}

export async function startImapListener() {
  await initKafkaProducer();

  imap = new Imap(imapConfig);

  imap.once("ready", () => {
    reconnectAttempts = 0;
    openInbox((err, box) => {
      if (err) {
        console.error("Failed to open inbox", err);
        reconnectWithBackoff();
        return;
      }
      console.log("IMAP INBOX opened, messages:", box.messages.total);

      checkNewMail().catch((e) => console.error("initial check error", e));

      imap.on("mail", (numNew) => {
        console.log("IMAP mail event: new messages", numNew);
        checkNewMail().catch((e) => console.error("mail event check error", e));
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP error", err);
    reconnectWithBackoff();
  });

  imap.once("end", () => {
    console.warn("IMAP connection ended");
    reconnectWithBackoff();
  });

  imap.connect();
}

function reconnectWithBackoff() {
  try {
    imap.removeAllListeners();
  } catch (e) {}
  reconnectAttempts++;
  const delay = Math.min(
    1000 * Math.pow(2, reconnectAttempts),
    MAX_RECONNECT_DELAY,
  );
  console.log(`Reconnecting IMAP in ${delay}ms (attempt ${reconnectAttempts})`);
  setTimeout(() => {
    startImapListener().catch((e) => console.error("reconnect start error", e));
  }, delay);
}

async function checkNewMail() {
  if (!imap || !imap.state || imap.state !== "authenticated") return;
  const searchAsync = promisify(imap.search.bind(imap));
  let results;
  try {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    results = await searchAsync(["UNSEEN", ["SINCE", since.toUTCString()]]);
  } catch (err) {
    console.error("IMAP search error", err);
    return;
  }
  if (!results || results.length === 0) return;

  const f = imap.fetch(results, { bodies: "", markSeen: true });
  f.on("message", (msg) => {
    let raw = "";
    msg.on("body", (stream) => {
      stream.on("data", (chunk) => (raw += chunk.toString("utf8")));
    });
    msg.once("end", async () => {
      try {
        const parsed = await simpleParser(raw);
        await handleIncomingEmail(parsed);
      } catch (e) {
        console.error("Failed to parse incoming mail", e);
      }
    });
  });
  f.once("error", (err) => {
    console.error("Fetch error:", err);
  });
  f.once("end", () => {
    console.log("Done fetching new messages.");
  });
}

function normalizeSubject(s) {
  return (s || "")
    .toLowerCase()
    .replace(/^(re|fwd|fw):\s*/i, "")
    .trim();
}

function extractReplyText(fullText = "") {
  if (!fullText) return null;

  const lines = fullText.split("\n");
  const replyLines = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("On ") && trimmed.endsWith("wrote:")) {
      break;
    }

    if (trimmed.startsWith(">")) {
      break;
    }

    if (/^-+original message-+/i.test(trimmed)) {
      break;
    }

    replyLines.push(line);
  }

  return replyLines.join("\n").trim() || null;
}

async function handleIncomingEmail(parsed) {
  const inReplyTo = parsed.inReplyTo;
  const references = parsed.references;
  const subject = parsed.subject || "";
  const normalizedSubject = normalizeSubject(subject);
  const fromAddress = parsed.from?.value?.[0]?.address || null;
  const messageId = parsed.messageId || null;
  const receivedAt = parsed.date || new Date();
  await produceActivityEvent(
    `You received reply for your query from: ${fromAddress}`,
  );

  if (!fromAddress) {
    console.warn("Incoming email without fromAddress — skipping.");
    return;
  }

  const vendorExists = await prisma.vendor.findUnique({
    where: { email: fromAddress },
  });

  if (!vendorExists) {
    console.warn(
      "Ignoring incoming email — sender is NOT a vendor:",
      fromAddress,
    );
    return;
  }
  console.log("Incoming mail", {
    subject,
    inReplyTo,
    references,
    messageId,
    fromAddress,
  });

  let matchedSent = null;

  if (inReplyTo) {
    const ids = Array.isArray(inReplyTo)
      ? inReplyTo
      : inReplyTo.toString().split(/\s+/);
    for (const id of ids) {
      const trimmed = id.trim();
      if (!trimmed) continue;
      const sent = await prisma.emailSent.findFirst({
        where: { messageId: trimmed },
      });
      if (sent) {
        matchedSent = sent;
        break;
      }
    }
  }

  if (!matchedSent && references) {
    const refs = Array.isArray(references)
      ? references
      : references.toString().split(/\s+/);
    for (const r of refs) {
      const trimmed = r.trim();
      if (!trimmed) continue;
      const sent = await prisma.emailSent.findFirst({
        where: { messageId: trimmed },
      });
      if (sent) {
        matchedSent = sent;
        break;
      }
    }
  }

  if (!matchedSent && fromAddress) {
    const sentCandidate = await prisma.emailSent.findFirst({
      where: { vendorEmail: fromAddress },
      orderBy: { sentAt: "desc" },
    });
    if (sentCandidate) matchedSent = sentCandidate;
  }

  let promptId = matchedSent ? matchedSent.promptId : null;
  if (!promptId) {
    const possible = await prisma.rFPRequest.findFirst({
      where: { prompt: { contains: normalizedSubject, mode: "insensitive" } },
    });
    if (possible) promptId = possible.id;
  }

  if (!promptId) {
    console.warn(
      "Could not determine promptId for incoming reply — saving to inbound logs.",
    );
    return;
  }

  const vendorEmail =
    fromAddress || (matchedSent && matchedSent.vendorEmail) || "unknown";
  const rawText = parsed.text || "";
  const replyOnlyText = extractReplyText(rawText);
  const reply = await prisma.emailReply.create({
    data: {
      promptId,
      vendorEmail,
      messageId: messageId,
      bodyText: replyOnlyText || null,
      createdAt: receivedAt,
      processed: false,
    },
  });

  if (matchedSent) {
    try {
      await prisma.emailSent.update({
        where: { id: matchedSent.id },
        data: { replied: true },
      });
    } catch (e) {
      console.warn("Failed to update EmailSent.replied", e);
    }
  }

  try {
    await produceReplyReceived(reply.id, promptId);
  } catch (e) {
    console.error("Failed to produce reply.received event", e);
  }
}

export async function stopImapListener() {
  try {
    if (imap && imap.state === "authenticated") {
      imap.end();
      console.log("IMAP connection ended by request");
    }
  } catch (e) {
    console.warn("Error closing IMAP", e);
  }
  try {
    await shutdownProducer();
  } catch (e) {}
}
