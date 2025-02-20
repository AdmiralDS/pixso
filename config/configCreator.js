const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const askQuestion = query => new Promise(resolve => rl.question(query, answer => resolve(answer.trim())));

const platformChoices = ["WEB", "MOBILE", "IOS", "ANDROID", "FLUTTER"];
const namingConventions = ["camelCase", "PascalCase", "snake_case", "SCREAMING_SNAKE_CASE", "kebab-case", "flatcase", "none"];

async function createConfigFile() {
    console.log("Setting up configuration for file generation...");
    const themes = [];
    
    while (true) {
        console.log("\nChoose platform:");
        const platform = await selectOption("", platformChoices);
        const outputFilePath = await getValidFilePath();
        const items = [];
        
        while (true) {
            const lastThemeItem = themes.length > 0 ? themes[themes.length - 1].items.slice(-1)[0] : null;
            const lastItem = items.length > 0 ? items[items.length - 1] : null;
            items.push(await getItemDetails(lastThemeItem, lastItem));
            if (!(await getBooleanInput("Add another item?"))) break;
        }
        
        themes.push({ platform, outputFilePath, items });
        if (!(await getBooleanInput("Add another theme?"))) break;
    }
    
    const configPath = path.join(__dirname, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(themes, null, 2), 'utf8');
    console.log(`\n✅ Configuration file successfully created: ${configPath}`);
    rl.close();
}

async function getItemDetails(lastThemeItem, lastItem) {
    console.log("\nAdding a new item...");
    const type = await askQuestion("Enter item type (COLOR or SHADOW): ");
    const name = await askQuestion("Enter name (e.g., color or boxShadow): ");
    
    let duplicateItem = lastThemeItem ?? lastItem;
    if (duplicateItem && await getBooleanInput("Duplicate previous item?")) {
        console.log("\n✅ Item duplicated with updated type and name.");
        return { ...duplicateItem, type, name };
    }
    
    return {
        type,
        name,
        apiBaseUrl: await askQuestion("Enter API URL: "),
        fileKey: await askQuestion("Enter fileKey: "),
        templatePath: (await askQuestion("Enter template path (leave empty if not needed): ")) || undefined,
        transformRules: {
            removePercent: await getBooleanInput("Remove percentage from names?"),
            keepOnlyFirstUnderscore: await getBooleanInput("Keep only the first underscore?"),
            sort: await getBooleanInput("Sort items?"),
            namingConvention: await selectOption("Choose a naming convention:", namingConventions, "none")
        }
    };
}

async function selectOption(prompt, options, defaultValue = null) {
    console.log(`\n${prompt}`);
    options.forEach((opt, index) => console.log(`${index + 1} - ${opt}`));
    while (true) {
        const choice = await askQuestion("Enter your choice (1-" + options.length + "): ");
        if (options[choice - 1]) return options[choice - 1];
        if (defaultValue != null) return defaultValue;
        console.log("Invalid choice, please select a valid option (1-" + options.length + ").");
    }
}

async function getBooleanInput(prompt) {
    const answer = await askQuestion(`${prompt} (true/false): `);
    if (answer != "true" && answer != "false") return true;
    return answer.toLowerCase() === "true";
}

async function getValidFilePath() {
    while (true) {
        const filePath = await askQuestion("Enter the output file path with file extension, like color.dark.ts or color.dark.swift: ");
        const dirPath = path.dirname(filePath);

        // Проверяем, существует ли файл и доступна ли директория
        try {
            // Проверка, существует ли директория
            await fs.promises.access(dirPath, fs.constants.R_OK | fs.constants.W_OK);

            // Проверка, что путь ведет к файлу, а не директории
            const stats = await fs.promises.stat(filePath);
            if (stats.isFile()) {
                return filePath;
            } else {
                console.log("The specified path is not a file. Please enter a valid file path.");
            }
        } catch (err) {
            console.log("Invalid path or directory is not accessible. Please enter a valid file path.");
        }
    }
}

module.exports = { createConfigFile };
