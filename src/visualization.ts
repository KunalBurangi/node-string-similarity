import chalk from "chalk";

export function visualizeStringDifferences(str1: string, str2: string): string {
  const str1Array = Array.from(str1);
  const str2Array = Array.from(str2);

  const maxLength = Math.max(str1Array.length, str2Array.length);
  let visualization = "";

  for (let i = 0; i < maxLength; i++) {
    if (str1Array[i] === str2Array[i]) {
      visualization += chalk.green(str1Array[i] || " ");
    } else {
      visualization += chalk.red(str1Array[i] || " ");
    }
  }

  return visualization;
}

export default { visualizeStringDifferences };