import app from "./app.js";
import { startImapListener } from "./services/imapService.js";
import { startReplyEvaluatorConsumer } from "./services/replyEvaluatorConsumer.js";
import { startActivityConsumer } from "./services/activityConsumer.js";

const PORT = process.env.PORT || 3000;

startReplyEvaluatorConsumer().catch((e) => {
  console.error("Reply evaluator worker error", e);
  process.exit(1);
});

startActivityConsumer().catch((e) => {
  console.error("Activity consumer worker error", e);
  process.exit(1);
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await startImapListener();
  } catch (e) {
    console.error("Failed to start IMAP listener", e);
  }
});
