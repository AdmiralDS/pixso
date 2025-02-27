const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
require("dotenv").config({ path: getEnvFilePath() });

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
    require("dotenv").config({ path: envFilePath });
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
  return path.join(__dirname, ".env.secret");
}

module.exports = { getCredentials };
