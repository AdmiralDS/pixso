const { getMapImages } = require("../pixso/pixso_service");

async function getImages(
  baseURL,
  fileKey,
  token,
) {
  try {
    const colors = await getMapImages(baseURL, fileKey, token);

    console.log(colors);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

module.exports = { getImages };
