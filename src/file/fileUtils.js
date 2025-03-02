import { writeFileSync, appendFileSync, existsSync } from "node:fs";

function writeToFile(filePath, content) {
  try {
    writeFileSync(filePath, content, "utf8");
  } catch (err) {
    console.error(`File error ${filePath}:`, err);
  }
}

function appendToFile(filePath, content) {
  try {
    appendFileSync(filePath, content, "utf8");
  } catch (err) {
    console.error(`File error ${filePath}:`, err);
  }
}

function clearFile(outputFilePath) {
  try {
    if (existsSync(outputFilePath)) {
      writeFileSync(outputFilePath, "", "utf8");
    } else {
      console.warn(`File ${outputFilePath} not clear`);
    }
  } catch (err) {
    console.error(`File error ${outputFilePath}:`, err);
  }
}

export default { writeToFile, clearFile, appendToFile };
