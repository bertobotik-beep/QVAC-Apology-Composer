// QVAC Apology Composer — core logic.
// Writes a sincere apology reasoning about the specific situation + severity.

import { completion } from "@qvac/sdk";

const SEVERITY_GUIDANCE = {
  minor: "This is a minor, casual situation (e.g. running late, a small mistake between friends). Keep the tone light, warm, and brief (3-4 sentences). No need for heavy formality.",
  moderate: "This is a moderate situation that caused real inconvenience or hurt feelings. Be sincere and specific, acknowledge the impact, and offer to make it right. 4-6 sentences.",
  serious: "This is a serious, formal situation requiring a genuinely accountable apology (e.g. a significant breach of trust, a professional failure). Be formal, take clear responsibility without excuses, acknowledge the specific impact, and state what you'll do differently. 5-8 sentences.",
};

function looksUnusable(text) {
  if (!text || text.trim().length < 20) return true;
  const bad = [
    "i cannot", "i can't", "as an ai", "i'm not able", "i do not have", "i don't have",
    "not enough information", "please provide more", "could you provide", "can you provide",
  ];
  const lower = text.toLowerCase();
  return bad.some((p) => lower.includes(p));
}

export async function composeApology(modelId, situation, severity) {
  const guidance = SEVERITY_GUIDANCE[severity] || SEVERITY_GUIDANCE.moderate;

  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content: `You write sincere, specific apology messages. Read the situation the user describes and write an apology message as if the user is sending it to the person they wronged.

${guidance}

Reference the actual specific details of the situation described — do not write a generic template. Output ONLY the apology message itself, no preamble like "Here's your apology:", no quotation marks, no labels.`,
      },
      { role: "user", content: `Situation: ${situation}` },
    ],
    stream: true,
    completionOpts: { temperature: 0.7, maxTokens: 400 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;

  text = text
    .trim()
    .replace(/^.*?\b(?:here'?s|here is)\b[^:\n]*:\s*\n*/i, "")
    .trim()
    .replace(/^subject:[^\n]*\n+/i, "")
    .trim()
    .replace(/^["']/, "")
    .replace(/["']$/, "")
    .trim();

  if (looksUnusable(text)) {
    text = "I'm sorry — I should have handled this better. I take responsibility for what happened, and I want to make it right. Please let me know how I can.";
  }

  return { result: text };
}
