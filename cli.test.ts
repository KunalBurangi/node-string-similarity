import { exec } from "child_process";
import path from "path";

const cliPath = path.resolve(__dirname, "../src/cli.ts");

function runCLI(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(`ts-node ${cliPath} ${args.join(" ")}`, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

describe("CLI Tests", () => {
  test("compare command with valid strings", async () => {
    const output = await runCLI(["compare", "hello", "world"]);
    expect(output).toMatch(/Similarity \(default\):/);
  });

  test("jaro-winkler command with valid strings", async () => {
    const output = await runCLI(["jaro-winkler", "hello", "world"]);
    expect(output).toMatch(/Similarity \(Jaro-Winkler\):/);
  });

  test("cosine command with valid strings", async () => {
    const output = await runCLI(["cosine", "hello", "world"]);
    expect(output).toMatch(/Similarity \(Cosine\):/);
  });

  test("dice command with valid strings", async () => {
    const output = await runCLI(["dice", "hello", "world"]);
    expect(output).toMatch(/Similarity \(Dice Coefficient\):/);
  });

  test("missing command", async () => {
    await expect(runCLI([])).rejects.toMatch(/You need to specify a command/);
  });

  test("invalid command", async () => {
    await expect(runCLI(["invalid-command"])).rejects.toMatch(
      /Unknown argument: invalid-command/,
    );
  });

  test("missing arguments for compare", async () => {
    await expect(runCLI(["compare", "hello"])).rejects.toMatch(
      /Not enough non-option arguments/,
    );
  });
});
