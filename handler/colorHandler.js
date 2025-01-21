const { getMapColors } = require('../pixso/pixso_service');
const { renderTemplate } = require('../handler/templateHandler');
const { appendToFile } = require('../file/fileUtils');
const { parseRules } = require('../transform/transformRules');

async function getColors(baseURL, fileKey, name, token, templatePath, outputFilePath, transformRules) {
    try {
        const colors = await getMapColors(baseURL, fileKey, token);

        const rules = parseRules(transformRules);

        var transformedColors = colors.map(color => {
            let transformedColorName = color.name;
            rules.forEach(func => {
                transformedColorName = func(transformedColorName);
            });
            return { name: transformedColorName, value: color.value };
        });

        if (transformRules.sort == true) {
            transformedColors = transformedColors.sort((a, b) => a.name.localeCompare(b.name));
        }

        const rendered = await renderTemplate(templatePath, {
            name: name,
            colors: transformedColors
        });

        appendToFile(outputFilePath, rendered);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

module.exports = { getColors };