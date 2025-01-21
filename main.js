const path = require('path');
const { loadConfig } = require('./config/configLoader');
const { getToken } = require('./auth/auth');
const { clearFile } = require('./file/fileUtils');
const { getColors } = require('./handler/colorHandler');
const { getShadows } = require('./handler/shadowHandler');
const { getDefaultColorTemplatePath, getDefaultShadowTemplatePath } = require('./config/defaultTemplate');

async function main() {
    let configs;
    try {
        const configPath = path.join(__dirname, 'config.json');
        configs = await loadConfig(configPath);
    } catch (err) {
        console.error('Error reading or parsing the configuration file:', err);
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

async function processItem(item, config) {
    const baseURL = item.apiBaseUrl || '';
    const fileKey = item.fileKey || '';
    const type = item.type || '';
    const name = item.name || '';
    const templateColorPath = item.templatePath || getDefaultColorTemplatePath(__dirname, config.platform);
    const templateShadowPath = item.templatePath || getDefaultShadowTemplatePath(__dirname, config.platform);

    if (!baseURL || !fileKey || !type || !name) {
        console.error('Error: Missing required properties');
        return;
    }

    let token = "";
    try {
        token = await getToken(baseURL);
    } catch (err) {
        console.error('Can not get token:', err.message);
    }

    if (type === "COLOR") {
        await getColors(baseURL, fileKey, name, token, templateColorPath, config.outputFilePath, item.transformRules);
    } else if (type === "SHADOW") {
        await getShadows(baseURL, fileKey, name, token, templateShadowPath, config.outputFilePath, item.transformRules);
    }
}

main()