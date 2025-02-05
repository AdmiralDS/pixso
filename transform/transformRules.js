function parseRules(nameTransformRules) {
    const funcs = [];

    if (nameTransformRules.removePercent == true) {
        funcs.push((input) => input.replace(/%/g, ''));
    }

    if (nameTransformRules.namingConvention) {
        funcs.push((input) => {
            let words = input
                .replace(/[^a-zA-Z0-9]+/g, ' ')
                .trim()
                .split(/\s+/);

            switch (nameTransformRules.namingConvention) {
                case 'camelCase':
                    return words
                        .map((word, index) =>
                            index === 0
                                ? word.toLowerCase()
                                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        )
                        .join('');
                case 'PascalCase':
                    return words
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join('');
                case 'snake_case':
                    return words.map(word => word.toLowerCase()).join('_');

                case 'kebab-case':
                    return words.map(word => word.toLowerCase()).join('-');

                case 'flatcase':
                    return words.map(word => word.toLowerCase()).join('');

                default:
                    return input;
            }
        });
    }

    return funcs;
}

module.exports = { parseRules };