const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer.trim())));
}

async function createConfigFile() {
    console.log("Setting up configuration for file generation...");

    const platform = await askQuestion("Enter platform (e.g., WEB, ANDROID): ");
    const outputFilePath = await askQuestion("Enter the output file path: ");
    const items = [];

    let addMoreItems = true;
    while (addMoreItems) {
        console.log("\nAdding a new item...");

        const type = await askQuestion("Enter item type (COLOR or SHADOW): ");
        const name = await askQuestion("Enter name (e.g., color or boxShadow): ");
        const apiBaseUrl = await askQuestion("Enter API URL (e.g., https://pixso.t1-pixso.ru): ");
        const fileKey = await askQuestion("Enter fileKey: ");
        const templatePath = await askQuestion("Enter template path (leave empty if not needed): ");
        
        const removePercent = await askQuestion("Remove percentage from names? (true/false): ");
        const keepOnlyFirstUnderscore = await askQuestion("Keep only the first underscore? (true/false): ");
        const sort = await askQuestion("Sort items? (true/false): ");

        items.push({
            type,
            name,
            apiBaseUrl,
            fileKey,
            ...(templatePath ? { templatePath } : {}),
            transformRules: {
                removePercent: removePercent === "true",
                keepOnlyFirstUnderscore: keepOnlyFirstUnderscore === "true",
                sort: sort === "true"
            }
        });

        const addAnother = await askQuestion("Add another item? (yes/no): ");
        addMoreItems = addAnother.toLowerCase() === "yes";
    }

    const configData = [{
        platform,
        outputFilePath,
        items
    }];

    const configPath = path.join(__dirname, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf8');

    console.log(`\n✅ Configuration file successfully created: ${configPath}`);
    rl.close();
}

module.exports = { createConfigFile };
