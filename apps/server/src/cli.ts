import "dotenv/config";
import { runEval } from "./services/runner.service";

const strategy =
  process.argv.find((x) => x.includes("--strategy"))?.split("=")[1] ||
  "zero_shot";

(async () => {
  console.log("Running eval:", strategy);

  const results = await runEval(strategy);

  console.log("Done");
  console.log(results.slice(0, 5));
})();