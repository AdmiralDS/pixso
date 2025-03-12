import { getCredentials } from "../credential/credential.js";
import { request } from "node:https";
import { stringify } from "node:querystring";
import { URL } from "node:url";
import { Buffer } from "node:buffer";

async function getToken(baseURL) {
  const { clientID, clientSecret } = await getCredentials();

  const data = stringify({
    grant_type: "client_credentials",
    scope: "all_scopes",
    client_id: clientID,
    client_secret: clientSecret,
  });

  const options = {
    hostname: new URL(baseURL).hostname,
    port: 443,
    path: "/api/oauth/oauth/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(data),
    },
  };

  return new Promise((resolve, reject) => {
    const req = request(options, (res) => {
      let responseBody = "";

      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        try {
          const parsedBody = JSON.parse(responseBody);
          if (parsedBody.access_token) {
            resolve(parsedBody.access_token);
          } else {
            reject(new Error("Failed to obtain token"));
          }
        } catch (err) {
          reject(new Error(`JSON parsing error: ${err.message}`));
        }
      });
    });

    req.on("error", (err) => {
      reject(new Error(`Request error: ${err.message}`));
    });

    req.write(data);
    req.end();
  });
}

export { getToken };
