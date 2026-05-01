import Anthropic from "@anthropic-ai/sdk";
import Ajv2020 from "ajv/dist/2020";
import fs from "fs";

const schema = JSON.parse(
  fs.readFileSync("data/schema.json", "utf-8")
);

const ajv = new Ajv2020({ strict: false, allErrors: true });
const validate = ajv.compile(schema);

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function extractWithRetry(transcript: string, strategy: string) {
  let attempts: any[] = [];

  for (let i = 0; i < 3; i++) {
    const res = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: getPrompt(strategy),
      messages: [{ role: "user", content: transcript }],
      tools: [
        {
          name: "extract",
          description: "Extract structured medical info",
          input_schema: schema,
        },
      ],
    });

    const tool = res.content.find((c: any) => c.type === "tool_use");

    if (!tool) continue;

    const output = tool.input;

    const valid = validate(output);

    attempts.push({ output, valid });

    if (valid) {
      return { output, attempts };
    }
  }

  return { output: null, attempts };
}

function getPrompt(strategy: string) {
  if (strategy === "few_shot") {
    return "Extract structured JSON strictly following schema.";
  }
  if (strategy === "cot") {
    return "Think step by step, then output structured JSON.";
  }
  return "Extract structured clinical JSON.";
}