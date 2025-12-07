import { kafka } from "./kafka.js";
import prisma from "../config/db.js";

const consumer = kafka.consumer({ groupId: "activity-logger-group" });

export async function startActivityConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "activity.events", fromBeginning: false });
  console.log("Activity consumer connected and subscribed");

  await consumer.run({
    eachMessage: async ({ message }) => {
      let payload;
      try {
        payload = JSON.parse(message.value.toString());
      } catch (e) {
        console.error(
          "Invalid activity message payload",
          e,
          message.value?.toString(),
        );
        return;
      }

      const { title, createdAt } = payload;

      try {
        await prisma.activity.create({
          data: {
            title,
            ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
          },
        });
      } catch (err) {
        console.error("Error saving activity", err);
      }
    },
  });
}

export async function stopActivityConsumer() {
  try {
    await consumer.disconnect();
    console.log("Activity consumer disconnected");
  } catch (e) {
    console.warn("Error disconnecting activity consumer", e);
  }
}
