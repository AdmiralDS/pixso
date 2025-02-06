const path = require('path');

function getDefaultColorTemplatePath(dirname, platform) {
    switch (platform) {
        case "WEB":
            return path.join(dirname, "templates/web/color.liquid");
        case "IOS":
            return path.join(dirname, "templates/ios/color.liquid");
        case "ANDROID":
            return path.join(dirname, "templates/android/color.liquid");
        default:
            return path.join(dirname, "templates/web/color.liquid");
    }
}

function getDefaultShadowTemplatePath(dirname, platform) {
    switch (platform) {
        case "WEB":
            return path.join(dirname, "templates/web/shadow.liquid");
        default:
            return path.join(dirname, "templates/web/shadow.liquid");
    }
}

module.exports = { getDefaultColorTemplatePath, getDefaultShadowTemplatePath };