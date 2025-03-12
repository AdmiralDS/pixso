import { appendToFile } from "../file/fileUtils.js";
import { getMapShadows } from "../pixso/pixso_service.js";
import { parseRules } from "../transform/transformRules.js";
import { renderTemplate } from "./templateHandler.js";

async function getShadows(
  baseURL,
  fileKey,
  name,
  token,
  templatePath,
  outputFilePath,
  transformRules,
) {
  try {
    const shadows = await getMapShadows(baseURL, fileKey, token);

    const rules = parseRules(transformRules);

    let transformedShadows = [];
    for (const shadow of shadows) {
      let transformedShadowName = shadow.name;
      for (const func of rules) {
        transformedShadowName = func(transformedShadowName);
      }
      transformedShadows.push({
        name: transformedShadowName,
        values: shadow.values.map((value) => ({
          x: value.x,
          y: value.y,
          spread: value.spread,
          radius: value.radius,
          red: value.red,
          green: value.green,
          blue: value.blue,
          alpha: value.alpha,
          isShowInset: value.isShowInset,
        })),
      });
    }    

    if (transformRules.sort) {
      transformedShadows = transformedShadows.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    const rendered = await renderTemplate(templatePath, {
      name: name,
      shadows: transformedShadows,
    });

    appendToFile(outputFilePath, rendered);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function getJSONShadows(
  baseURL,
  fileKey,
  name,
  token,
  templatePath,
  outputFilePath,
  transformRules
) {
  try {
    const shadows = await getMapShadows(baseURL, fileKey, token);

    const rules = parseRules(transformRules);

    let transformedShadows = [];
    for (const shadow of shadows) {
      let transformedShadowName = shadow.name;
      for (const func of rules) {
        transformedShadowName = func(transformedShadowName);
      }
      transformedShadows.push({
        name: transformedShadowName,
        values: shadow.values.map((value) => ({
          x: value.x,
          y: value.y,
          spread: value.spread,
          radius: value.radius,
          red: value.red,
          green: value.green,
          blue: value.blue,
          alpha: value.alpha,
          isShowInset: value.isShowInset,
        })),
      });
    }
    

    if (transformRules.sort) {
      transformedShadows = transformedShadows.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    const jsonOutput = JSON.stringify(transformedShadows, null, 2);
    console.log(jsonOutput);
    return jsonOutput;
  } catch (err) {
    console.error("Error:", err.message);
  }
}

export { getShadows, getJSONShadows };
