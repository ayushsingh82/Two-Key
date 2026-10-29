import { extractPost } from "./extract";
import type { Extraction, Post } from "./types";

const MODEL = "claude-haiku-5-5";

const PROMPT = `Extract trading signal fields from a crypto creator's post.
Reply with JSON only: {"token": string|null, "sentiment": number, "conviction": number, "urgency": number}
token is the uppercase ticker without $. sentiment is -1 (bearish) to 1 (bullish). conviction and urgency are 0 to 1.`;

/**
 * Optional LLM extractor. Needs ANTHROPIC_API_KEY. Falls back to the deterministic
 * extractor on any error, and results should be stored in the evidence snapshot so
 * replay never calls the model again.
 */
export async function extractPostLlm(post: Post): Promise<Extraction> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return extractPost(post);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 200,
        temperature: 0,
        system: PROMPT,
        messages: [{ role: "user", content: post.text }],
      }),
    });
    if (!res.ok) return extractPost(post);
    const body = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = body.content?.find((c) => c.type === "text")?.text ?? "";
    const parsed = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)) as Partial<Extraction>;
    const num = (v: unknown, lo: number, hi: number) => (typeof v === "number" ? Math.min(hi, Math.max(lo, v)) : 0);
    return {
      postId: post.id,
      token: typeof parsed.token === "string" ? parsed.token.toUpperCase() : null,
      sentiment: num(parsed.sentiment, -1, 1),
      conviction: num(parsed.conviction, 0, 1),
      urgency: num(parsed.urgency, 0, 1),
    };
  } catch {
    return extractPost(post);
  }
}
