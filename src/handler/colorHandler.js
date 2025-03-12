import { appendToFile } from "../file/fileUtils.js";
import { getMapColors } from "../pixso/pixso_service.js";
import { parseRules } from "../transform/transformRules.js";
import { renderTemplate } from "./templateHandler.js";

async function getColors(
  baseURL,
  fileKey,
  name,
  token,
  templatePath,
  outputFilePath,
  transformRules,
) {
  try {
    const colors = await getMapColors(baseURL, fileKey, token);

    const rules = parseRules(transformRules);

    let transformedColors = colors.map((color) => ({
      name: rules.reduce((acc, func) => func(acc), color.name),
      value: color.value,
    }));

    //TODO refactor sort
    if (transformRules.sort) {
      transformedColors = transformedColors.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    const rendered = await renderTemplate(templatePath, {
      name: name,
      colors: transformedColors,
    });

    appendToFile(outputFilePath, rendered);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function getJSONColors(
  baseURL,
  fileKey,
  name,
  token,
  templatePath,
  outputFilePath,
  transformRules
) {
  try {
    const colors = await getMapColors(baseURL, fileKey, token);

    const rules = parseRules(transformRules);
    //TODO refactor to reduce
    let transformedColors = colors.map((color) => {
      let transformedColorName = color.name;
      for (const func of rules) {
        transformedColorName = func(transformedColorName);
      }
      return { name: transformedColorName, value: color.value };
    });    

    if (transformRules.sort) {
      transformedColors = transformedColors.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    const jsonOutput = JSON.stringify(transformedColors, null, 2);

    return jsonOutput;
  } catch (err) {
    console.error("Error:", err.message);
  }
}

export { getColors, getJSONColors };
