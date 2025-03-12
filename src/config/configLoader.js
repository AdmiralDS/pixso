import { promises } from "node:fs";

async function loadConfig(configPath) {
  const configFile = await promises.readFile(configPath, "utf8");
  return JSON.parse(configFile);
}

export { loadConfig };
