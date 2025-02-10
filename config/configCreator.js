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

    console.log("\nChoose platform:");
    console.log("1 - WEB");
    console.log("2 - MOBILE");
    console.log("3 - IOS");
    console.log("4 - ANDROID");
    console.log("5 - FLUTTER");

    let platform;
    while (!platform) {
        const namingChoice = await askQuestion("Enter your choice (1-5): ");
        switch (namingChoice) {
            case "1":
                platform = "WEB";
                break;
            case "2":
                platform = "MOBILE";
                break;
            case "3":
                platform = "IOS";
                break;
            case "4":
                platform = "ANDROID";
                break;
            case "5":
                platform = "FLUTTER";
                break;
            default:
                console.log("Invalid choice, please select a valid option (1-5).");
        }
    }
    const outputFilePath = await askQuestion("Enter the output file path with file extention, like color.dark.ts or color.dark.swift: ");
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
        const sort = await askQuestion("Sort items? (true/false): ");

        console.log("\nChoose a naming convention:");
        console.log("1 - camelCase");
        console.log("2 - PascalCase");
        console.log("3 - snake_case");
        console.log("4 - kebab-case");
        console.log("5 - flatcase");

        let namingConvention;
        while (!namingConvention) {
            const namingChoice = await askQuestion("Enter your choice (1-5): ");
            switch (namingChoice) {
                case "1":
                    namingConvention = "camelCase";
                    break;
                case "2":
                    namingConvention = "PascalCase";
                    break;
                case "3":
                    namingConvention = "snake_case";
                    break;
                case "4":
                    namingConvention = "kebab-case";
                    break;
                case "5":
                    namingConvention = "flatcase";
                    break;
                default:
                    console.log("Invalid choice, please select a valid option (1-5).");
            }
        }

        items.push({
            type,
            name,
            apiBaseUrl,
            fileKey,
            ...(templatePath ? { templatePath } : {}),
            transformRules: {
                removePercent: removePercent === "true",
                sort: sort === "true",
                namingConvention
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
