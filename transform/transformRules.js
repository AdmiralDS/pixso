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
            }
            return input.replace(/\s/g, '');
        });
    }

    if (nameTransformRules.camelCase == true) {
        funcs.push((input) => {
            return input
                .toLowerCase()
                .replace(/_([a-zA-Z0-9])/g, (match, letter) => letter.toUpperCase())
                .replace(/^([A-Z])/, (match) => match.toLowerCase());
        });
    }

    return funcs;
}

module.exports = { parseRules };