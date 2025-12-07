import axios from "axios";

const MISTRAL_URL = process.env.MISTRAL_URL;

export async function generateRFPWithMistral(systemPrompt, userPrompt) {
  const payload = {
    model: "mistral",
    prompt: `${systemPrompt}\n\nUser Request:\n${userPrompt}`,
    stream: false,
  };

  const response = await axios.post(MISTRAL_URL, payload);
  return response.data.response;
}

export async function scoreReplyAgainstRfp(myPrompt, replyText) {
  const prompt = `
You are an expert evaluator for vendor proposals.

Your task:
Evaluate the vendor’s reply based on the RFP requirements and produce:
1. A numerical score (0 to 10)
2. A summary explaining the reasoning in detail

Evaluation Criteria & Weights:
- Completeness: 30%
- Technical Fit: 25%
- Feasibility: 15%
- Experience Relevance: 15%
- Communication Quality: 10%
- Differentiators: 5%

Scoring Rules:
- Score must be a number between 0 and 10.
- Respond in strict JSON with the following shape:
{
  "score": number,
  "summary": "string explaining the reasoning in detail"
}

Here is the RFP (requirements):
${JSON.stringify(myPrompt, null, 2)}

Here is the Vendor Reply:
${replyText}

Now evaluate the reply.
`;

  try {
    const resp = await axios.post(
      MISTRAL_URL,
      {
        model: "mistral",
        prompt,
        stream: false,
      },
      { timeout: 30000 },
    );

    let text = resp.data?.response || resp.data || "";

    if (typeof text !== "string") text = JSON.stringify(text);

    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      return { score: 0, summary: "Invalid JSON", raw: text };
    }

    const parsed = JSON.parse(match[0]);

    return {
      score: Number(parsed.score) || 0,
      summary: parsed.summary || "",
    };
  } catch (err) {
    console.error("Mistral scoring error:", err?.response?.data || err.message);
    return { score: 0, summary: "Model Error", raw: err.message };
  }
}
