import { join } from "node:path";

function getDefaultColorTemplatePath(dirname, platform) {
  switch (platform) {
    case "WEB":
      return join(dirname, "templates/web/color.liquid");
    case "IOS":
      return join(dirname, "templates/ios/color.liquid");
    case "ANDROID":
      return join(dirname, "templates/android/color.liquid");
    case "FLUTTER":
      return join(dirname, "templates/flutter/color.liquid");
    default:
      return join(dirname, "templates/web/color.liquid");
  }
}

function getDefaultShadowTemplatePath(dirname, platform) {
  switch (platform) {
    case "WEB":
      return join(dirname, "templates/web/shadow.liquid");
    default:
      return join(dirname, "templates/web/shadow.liquid");
  }
}

export { getDefaultColorTemplatePath, getDefaultShadowTemplatePath };
