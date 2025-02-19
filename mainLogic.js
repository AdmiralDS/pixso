const fs = require('fs');
const path = require('path');
const { createConfigFile } = require('./config/configCreator');
const { loadConfig } = require('./config/configLoader');
const { getToken } = require('./auth/auth');
const { clearFile } = require('./file/fileUtils');
const { getColors, getJSONColors } = require('./handler/colorHandler');
const { getShadows, getJSONShadows } = require('./handler/shadowHandler');
const { getDefaultColorTemplatePath, getDefaultShadowTemplatePath } = require('./config/defaultTemplate');

async function main() {
    const configPath = path.join(__dirname, 'config/config.json');

    if (!fs.existsSync(configPath)) {
        console.log("The config file.json was not found. Starting the setup...");
        await createConfigFile();
    }

    let configs;
    try {
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

async function getMainJSON() {
    const configPath = path.join(__dirname, 'config/config.json');

    if (!fs.existsSync(configPath)) {
        console.log("The config file.json was not found. Starting the setup...");
        await createConfigFile();
    }

    let configs;
    try {
        configs = await loadConfig(configPath);
    } catch (err) {
        console.error('Error reading or parsing the configuration file:', err);
        return;
    }

    for (const config of configs) {
        for (const item of config.items || []) {
            json = await processItemJSON(item, config);
            console.log(`💈 JSON for ${item.name || ''}:`);
            console.log(json);
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

async function processItemJSON(item, config) {
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
        return await getJSONColors(baseURL, fileKey, name, token, templateColorPath, config.outputFilePath, item.transformRules);
    } else if (type === "SHADOW") {
        return await getJSONShadows(baseURL, fileKey, name, token, templateShadowPath, config.outputFilePath, item.transformRules);
    }
}

module.exports = { main, getMainJSON };