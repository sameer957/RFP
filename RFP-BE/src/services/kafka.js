import { Kafka } from "kafkajs";

const brokers = (process.env.KAFKA_BROKERS || "localhost:9092").split(",");

const kafka = new Kafka({
  clientId: "rfp-app",
  brokers,
});

const producer = kafka.producer();
let producerConnected = false;

export async function initKafkaProducer() {
  if (producerConnected) return;
  try {
    await producer.connect();
    producerConnected = true;
    console.log("Kafka producer connected");
  } catch (err) {
    console.error("Kafka producer connect error", err);
    throw err;
  }
}

export async function produceReplyReceived(replyId, promptId) {
  if (!producerConnected) {
    await initKafkaProducer();
  }
  const topic = "reply.received";
  const payload = { replyId, promptId };
  await producer.send({
    topic,
    messages: [{ key: String(replyId), value: JSON.stringify(payload) }],
  });
  console.log(
    `Produced event reply.received for replyId=${replyId} promptId=${promptId}`,
  );
}

export async function produceActivityEvent(title) {
  if (!producerConnected) {
    await initKafkaProducer();
  }

  const topic = "activity.events";
  const payload = {
    title,
    createdAt: new Date().toISOString(),
  };

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(payload) }],
  });

  console.log(`Produced activity event title=${title}`);
}

export async function shutdownProducer() {
  try {
    if (producerConnected) {
      await producer.disconnect();
      producerConnected = false;
      console.log("Kafka producer disconnected");
    }
  } catch (e) {
    console.warn("Kafka producer shutdown error", e);
  }
}

export { kafka };
