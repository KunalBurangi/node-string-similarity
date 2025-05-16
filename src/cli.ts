#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  compareStrings,
  jaroWinklerDistance,
  cosineSimilarity,
  diceCoefficient,
} from "./index";

yargs(hideBin(process.argv))
  .command<{ str1: string; str2: string }>(
    "compare <str1> <str2>",
    "Compare two strings using the default similarity algorithm",
    (yargs) => {
      return yargs
        .positional("str1", {
          describe: "First string",
          type: "string",
        })
        .positional("str2", {
          describe: "Second string",
          type: "string",
        });
    },
    (args) => {
      const result = compareStrings(args.str1, args.str2);
      console.log(`Similarity (default): ${result}`);
    },
  )
  .command<{ str1: string; str2: string }>(
    "jaro-winkler <str1> <str2>",
    "Compare two strings using the Jaro-Winkler algorithm",
    (yargs: import("yargs").Argv) => {
      return yargs
        .positional("str1", {
          describe: "First string",
          type: "string",
        })
        .positional("str2", {
          describe: "Second string",
          type: "string",
        });
    },
    (args: { str1: string; str2: string }) => {
      const result = jaroWinklerDistance(args.str1, args.str2);
      console.log(`Similarity (Jaro-Winkler): ${result}`);
    },
  )
  .command<{ str1: string; str2: string }>(
    "cosine <str1> <str2>",
    "Compare two strings using the Cosine Similarity algorithm",
    (yargs) => {
      return yargs
        .positional("str1", {
          describe: "First string",
          type: "string",
        })
        .positional("str2", {
          describe: "Second string",
          type: "string",
        });
    },
    (args: { str1: string; str2: string }) => {
      const result = cosineSimilarity(args.str1, args.str2);
      console.log(`Similarity (Cosine): ${result}`);
    },
  )
  .command<{ str1: string; str2: string }>(
    "dice <str1> <str2>",
    "Compare two strings using the Dice Coefficient algorithm",
    (yargs) => {
      yargs.positional("str1", {
        describe: "First string",
        type: "string",
      });
      yargs.positional("str2", {
        describe: "Second string",
        type: "string",
      });
    },
    (args: { str1: string; str2: string }) => {
      const result = diceCoefficient(args.str1, args.str2);
      console.log(`Similarity (Dice Coefficient): ${result}`);
    },
  )
  .demandCommand(1, "You need to specify a command")
  .help()
  .alias("help", "h")
  .strict()
  .parse();
