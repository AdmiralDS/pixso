const fs = require("node:fs");

function writeToFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, "utf8");
  } catch (err) {
    console.error(`File error ${filePath}:`, err);
  }
}

function appendToFile(filePath, content) {
  try {
    fs.appendFileSync(filePath, content, "utf8");
  } catch (err) {
    console.error(`File error ${filePath}:`, err);
  }
}

function clearFile(outputFilePath) {
  try {
    if (fs.existsSync(outputFilePath)) {
      fs.writeFileSync(outputFilePath, "", "utf8");
    } else {
      console.warn(`File ${outputFilePath} not clear`);
    }
  } catch (err) {
    console.error(`File error ${outputFilePath}:`, err);
  }
}

module.exports = { writeToFile, clearFile, appendToFile };
