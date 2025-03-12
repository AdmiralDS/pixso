import fs from "node:fs";
import path from "node:path";
import { join } from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filenameURLToPath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filenameURLToPath);

async function promptUserForCredentials() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (query) =>
    new Promise((resolve) => rl.question(query, resolve));

  try {
    const clientID = (await askQuestion("Enter CLIENT_ID: ")).trim();
    const clientSecret = (await askQuestion("Enter CLIENT_SECRET: ")).trim();
    rl.close();
    return { clientID, clientSecret };
  } catch (error) {
    rl.close();
    throw error;
  }
}

function loadEnv() {
  try {
    const envFilePath = getEnvFilePath();
    dotenv.config({ path: envFilePath });
  } catch (error) {
    console.error(
      ".env.secret file not found or an error occurred while loading environment variables."
    );
  }
}

function saveEnv(clientID, clientSecret) {
  const envFilePath = getEnvFilePath();
  const content = `CLIENT_ID=${clientID}\nCLIENT_SECRET=${clientSecret}\n`;
  fs.writeFileSync(envFilePath, content);
}

async function getCredentials() {
  loadEnv();

  let clientID = process.env.CLIENT_ID || "";
  let clientSecret = process.env.CLIENT_SECRET || "";

  if (!clientID || !clientSecret) {
    console.log("Environment variables CLIENT_ID and CLIENT_SECRET not found.");
    try {
      const credentials = await promptUserForCredentials();
      clientID = credentials.clientID;
      clientSecret = credentials.clientSecret;
      saveEnv(clientID, clientSecret);
    } catch (error) {
      throw new Error("Error entering credentials");
    }
  }

  return { clientID, clientSecret };
}

function getEnvFilePath() {
  console.log(path.join(__dirname, ".env.secret"));
  return path.join(__dirname, ".env.secret");
}

export { getCredentials };
