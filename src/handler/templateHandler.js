const { Liquid } = require("liquidjs");
const fs = require("node:fs");

async function renderTemplate(templatePath, context) {
  const engine = new Liquid();
  const template = fs.readFileSync(templatePath, "utf8");
  return engine.parseAndRender(template, context);
}

module.exports = { renderTemplate };
