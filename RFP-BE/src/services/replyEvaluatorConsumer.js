import { kafka } from "./kafka.js";
import { scoreReplyAgainstRfp } from "./llmService.js";
import prisma from "../config/db.js";
const consumer = kafka.consumer({ groupId: "reply-evaluator-group" });

export async function startReplyEvaluatorConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "reply.received", fromBeginning: false });
  console.log("Reply evaluator consumer connected and subscribed");

  await consumer.run({
    eachMessage: async ({ message }) => {
      let payload;
      try {
        payload = JSON.parse(message.value.toString());
      } catch (e) {
        console.error("Invalid message payload", e, message.value?.toString());
        return;
      }

      const { replyId, promptId } = payload;

      console.log("Received reply event", payload);

      try {
        const reply = await prisma.emailReply.findUnique({
          where: { id: replyId },
        });

        if (!reply) {
          console.log("No replies found for promptId", promptId);
          return;
        }

        const rfp = await prisma.rfpResponse.findFirst({
          where: { promptId: promptId },
        });

        const { score, summary } = await scoreReplyAgainstRfp(
          rfp.rfpJson,
          reply.bodyText,
        );

        await prisma.emailReply.update({
          where: { id: replyId },
          data: { processed: true, score: score, summary: summary },
        });

        await prisma.$transaction(async (tx) => {
          await tx.emailReply.updateMany({
            where: { promptId },
            data: { selected: false },
          });

          const best = await tx.emailReply.findFirst({
            where: { promptId },
            orderBy: { score: "desc" },
          });

          if (best) {
            await tx.emailReply.update({
              where: { id: best.id },
              data: { selected: true },
            });
          }
        });
      } catch (err) {
        console.error("Error processing reply event", err);
      }
    },
  });
}

export async function stopReplyEvaluatorConsumer() {
  try {
    await consumer.disconnect();
    console.log("Reply evaluator consumer disconnected");
  } catch (e) {
    console.warn("Error disconnecting consumer", e);
  }
}
