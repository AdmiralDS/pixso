import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, path } from "node:path";
import { createConfigFile } from "./config/configCreator";
import { loadConfig } from "./config/configLoader";
import { getToken } from "./auth/auth";
import { clearFile } from "./file/fileUtils";
import { getColors, getJSONColors } from "./handler/colorHandler";
import { getShadows, getJSONShadows } from "./handler/shadowHandler";
import {
  getDefaultColorTemplatePath,
  getDefaultShadowTemplatePath,
} from "./config/defaultTemplate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const configPath = join(__dirname, "config/config.json");

  if (!existsSync(configPath)) {
    console.log("The config file.json was not found. Starting the setup...");
    await createConfigFile();
  }

  let configs;
  try {
    configs = await loadConfig(configPath);
  } catch (err) {
    console.error("Error reading or parsing the configuration file:", err);
    return;
  }

  for (const config of configs) {
    if (!config.outputFilePath) continue;

    clearFile(config.outputFilePath);

    for (const item of config.items || []) {
      await processItem(item, config);
    }
  }
}

async function getMainJSON() {
  const configPath = join(__dirname, "config/config.json");

  if (!existsSync(configPath)) {
    console.log("The config file.json was not found. Starting the setup...");
    await createConfigFile();
  }

  let configs;
  try {
    configs = await loadConfig(configPath);
  } catch (err) {
    console.error("Error reading or parsing the configuration file:", err);
    return;
  }

  for (const config of configs) {
    for (const item of config.items || []) {
      json = await processItemJSON(item, config);
      console.log(`💈 JSON for ${item.name || ""}:`);
      console.log(json);
    }
  }
}

async function processItem(item, config) {
  const baseURL = item.apiBaseUrl || "";
  const fileKey = item.fileKey || "";
  const type = item.type || "";
  const name = item.name || "";
  const templateColorPath =
    item.templatePath ||
    getDefaultColorTemplatePath(__dirname, config.platform);
  const templateShadowPath =
    item.templatePath ||
    getDefaultShadowTemplatePath(__dirname, config.platform);

  if (!baseURL || !fileKey || !type || !name) {
    console.error("Error: Missing required properties");
    return;
  }

  let token = "";
  try {
    token = await getToken(baseURL);
  } catch (err) {
    console.error("Can not get token:", err.message);
  }

  if (type === "COLOR") {
    await getColors(
      baseURL,
      fileKey,
      name,
      token,
      templateColorPath,
      config.outputFilePath,
      item.transformRules
    );
  } else if (type === "SHADOW") {
    await getShadows(
      baseURL,
      fileKey,
      name,
      token,
      templateShadowPath,
      config.outputFilePath,
      item.transformRules
    );
  }
}

async function processItemJSON(item, config) {
  const baseURL = item.apiBaseUrl || "";
  const fileKey = item.fileKey || "";
  const type = item.type || "";
  const name = item.name || "";
  const templateColorPath =
    item.templatePath ||
    getDefaultColorTemplatePath(__dirname, config.platform);
  const templateShadowPath =
    item.templatePath ||
    getDefaultShadowTemplatePath(__dirname, config.platform);

  if (!baseURL || !fileKey || !type || !name) {
    console.error("Error: Missing required properties");
    return;
  }

  let token = "";
  try {
    token = await getToken(baseURL);
  } catch (err) {
    console.error("Can not get token:", err.message);
  }

  if (type === "COLOR") {
    return await getJSONColors(
      baseURL,
      fileKey,
      name,
      token,
      templateColorPath,
      config.outputFilePath,
      item.transformRules
    );
  }

  if (type === "SHADOW") {
    return await getJSONShadows(
      baseURL,
      fileKey,
      name,
      token,
      templateShadowPath,
      config.outputFilePath,
      item.transformRules
    );
  }
}

export default { main, getMainJSON };
