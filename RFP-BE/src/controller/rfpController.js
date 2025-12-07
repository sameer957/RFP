import prisma from "../config/db.js";
import { templates } from "../utils/templates.js";
import { generateRFPWithMistral } from "../services/llmService.js";
import sendMail from "../services/mailer.js";
import { emailTemplate } from "../utils/emailTemplates.js";
import { produceActivityEvent } from "../services/kafka.js";
import { getTimeAgo } from "../utils/timeHelper.js";

export const generateRFP = async (req, res) => {
  try {
    const { prompt } = req.body;

    const lastTemplateUsed = await prisma.templates.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const selectedTemp = templates.find(
      (t) => t.id === lastTemplateUsed?.templateId,
    );

    const ans = await generateRFPWithMistral(
      selectedTemp?.systemPrompt
        ? selectedTemp?.systemPrompt
        : templates[0]?.systemPrompt,
      prompt,
    );

    let cleaned = ans.trim();

    if (cleaned.startsWith('"')) cleaned = cleaned.slice(1);
    if (cleaned.endsWith('"')) cleaned = cleaned.slice(0, -1);

    cleaned = cleaned.replace(/\\"/g, '"');

    let parsedJSON;
    try {
      parsedJSON = JSON.parse(cleaned);
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "AI returned invalid JSON",
        raw: cleaned,
      });
    }

    const savedPrompt = await prisma.rFPRequest.create({
      data: { prompt },
    });

    const savedResponse = await prisma.rfpResponse.create({
      data: {
        promptId: savedPrompt.id,
        rfpJson: parsedJSON,
      },
    });

    await produceActivityEvent(`You requested a proposal for: ${prompt}`);

    return res.status(200).json({
      success: true,
      message: "RFP created successfully",
      data: savedResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const sendRFP = async (req, res) => {
  try {
    const { vendorEmails, promptId, rfpJson } = req.body;

    if (!vendorEmails || vendorEmails.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No vendors selected" });
    }

    const subject = `RFP Invitation - ${rfpJson?.title ?? "New RFP"}`;

    const html = emailTemplate(rfpJson);

    const info = await sendMail({
      to: vendorEmails,
      subject,
      html,
      text: `RFP Invitation - ${rfpJson.title}`,
    });

    const emailSavePromises = vendorEmails.map(async (email) => {
      try {
        await prisma.EmailSent.create({
          data: { promptId: promptId, vendorEmail: email },
        });
      } catch (err) {
        if (err.code === "P2002") {
          console.log(`Duplicate email skipped: ${email}`);
        } else {
          console.error("DB Error:", err);
        }
      }
    });

    await Promise.all(emailSavePromises);

    await produceActivityEvent(`You send RFP to ${vendorEmails}`);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllRFPRequests = async (req, res) => {
  try {
    const rfps = await prisma.rfpResponse.findMany();

    const responses = rfps.map((r) => ({
      id: r.promptId,
      title: r.rfpJson.title,
      timeAgo: getTimeAgo(r.createdAt),
    }));

    return res.status(200).json({ success: true, data: responses });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSingleRFPDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const rfp = await prisma.EmailReply.findMany({
      where: { promptId: Number(id) },
    });

    const totalReplies = new Set(rfp.map((r) => r.vendorEmail)).size;

    if (!rfp) {
      return res.status(404).json({
        success: false,
        message: "RFP not found",
      });
    }

    return res.status(200).json({ success: true, totalReplies, data: rfp });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
