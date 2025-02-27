const fs = require("node:fs");
const path = require("node:path");

async function loadConfig(configPath) {
  const configFile = await fs.promises.readFile(configPath, "utf8");
  return JSON.parse(configFile);
}

module.exports = { loadConfig };
