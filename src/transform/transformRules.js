function parseRules(nameTransformRules) {
    const funcs = [];

    if (nameTransformRules.removePercent == true) {
        funcs.push((input) => input.replace(/%/g, ''));
    }

    if (nameTransformRules.keepOnlyFirstUnderscore == true) {
            funcs.push((input) => {
                input = input.replace('/', ' ');
                const firstSpaceIndex = input.indexOf(' ');
                if (firstSpaceIndex !== -1) {
                    input = input.slice(0, firstSpaceIndex) + '_' + input.slice(firstSpaceIndex + 1);
                let words = input
                    .replace(/[^a-zA-Z0-9]+/g, ' ')
                    .trim()
                    .split(/\s+/);

                return input.replace(/\s/g, '');
                }
            });
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
                case 'SCREAMING_SNAKE_CASE':
                        return words.map(word => word.toUpperCase()).join('_');
                case 'kebab-case':
                    return words.map(word => word.toLowerCase()).join('-');
                case 'flatcase':
                    return words.map(word => word.toLowerCase()).join('');
                case 'none':
                    return input;
                default:
                    return input;
            }
        });
    }

    return funcs;
}

module.exports = { parseRules };