import { extractWithRetry } from "@test-evals/llm";

export async function extract(transcript: string, strategy: string) {
  return extractWithRetry(transcript, strategy);
}