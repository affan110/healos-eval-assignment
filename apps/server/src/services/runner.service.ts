import fs from "fs";
import pLimit from "p-limit";
import { extract } from "./extract.service";
import { evaluate } from "./evaluate.service";

const limit = pLimit(5);

export async function runEval(strategy: string) {
  const files = fs.readdirSync("data/transcripts").slice(0, 5);

  const results: any[] = [];

  await Promise.all(
    files.map((file) =>
      limit(async () => {
        const transcript = fs.readFileSync(
          `data/transcripts/${file}`,
          "utf-8"
        );

        const gold = JSON.parse(
          fs.readFileSync(
            `data/gold/${file.replace(".txt", ".json")}`,
            "utf-8"
          )
        );

        const { output } = await extract(transcript, strategy);

        const score = evaluate(output, gold, transcript);

        results.push(score);
      })
    )
  );

  return results;
}