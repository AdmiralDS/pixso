const https = require('https');

function fetchJSON(url, token) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Request failed with status: ${res.statusCode}`));
        }
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error(`Failed to parse JSON: ${err.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`HTTP request error: ${err.message}`));
    });
  });
}

function formatValue(value) {
  return Number.isInteger(value) ? `${value}` : `${value.toFixed(1)}`;
}

function formatAlpha(alpha) {
  const alphaValue = alpha / 255.0;
  return Number.isInteger(alphaValue) ? `${alphaValue}` : alphaValue.toFixed(2);
}

function toHexColor(color) {
  const r = Math.round(color.r);
  const g = Math.round(color.g);
  const b = Math.round(color.b);
  
  let colorString = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  if (color.a !== undefined && color.a < 1) {
      const a = `${Math.round(color.a * 255).toString(16).padStart(2, "0").toUpperCase()}`;
      return `${colorString}${a}`;
  }
  return colorString;
}

async function getMapColors(apiBase, fileKey, token) {
  if (!fileKey) {
    throw new Error('fileKey cannot be empty');
  }

  const apiUrl = `${apiBase}/openapi/v1/file/library?file_key=${fileKey}`;
  const apiResponse = await fetchJSON(apiUrl, token);

  const result = [];
  const styles = apiResponse.data.styles;

  for (const styleId in styles) {
    const style = styles[styleId];

    if (!style.meta || !style.meta.style_thumbnail || !style.meta.style_thumbnail.fillPaints) continue;

    if (style.meta.style_thumbnail.fillPaints.length === 0) continue;

    const color = style.meta.style_thumbnail.fillPaints[0].color;
    result.push({
      name: style.name,
      value: toHexColor(color),
    });
  }

  return result;
}

async function getMapShadows(apiBase, fileKey, token) {
  if (!fileKey) {
    throw new Error('fileKey cannot be empty');
  }

  const apiUrl = `${apiBase}/openapi/v1/file/library?file_key=${fileKey}`;
  const apiResponse = await fetchJSON(apiUrl, token);

  const shadows = [];
  const styles = apiResponse.data.styles;

  for (const styleId in styles) {
    const style = styles[styleId];

    if (!style.meta || !style.meta.style_thumbnail || !style.meta.style_thumbnail.effects) continue;

    if (style.meta.style_thumbnail.effects.length === 0) continue;

    const shadowValues = [];

    for (const effect of style.meta.style_thumbnail.effects) {
      const { x, y } = effect.offset;
      const { radius, spread, color } = effect;
      const isShowInset = x < 0 || y < 0 ? 'true' : '';

      shadowValues.push({
        x: formatValue(x),
        y: formatValue(y),
        spread: formatValue(spread),
        radius: formatValue(radius),
        red: Math.round(color.r).toString(),
        green: Math.round(color.g).toString(),
        blue: Math.round(color.b).toString(),
        alpha: formatAlpha(color.a),
        isShowInset: isShowInset,
      });
    }

    shadows.push({
      name: style.name,
      values: shadowValues
    });
  }

  return shadows;
}

module.exports = { getMapColors, getMapShadows };