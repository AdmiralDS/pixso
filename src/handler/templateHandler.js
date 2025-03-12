import { Liquid } from "liquidjs";
import { readFileSync } from "node:fs";

async function renderTemplate(templatePath, context) {
  const engine = new Liquid();
  const template = readFileSync(templatePath, "utf8");
  return engine.parseAndRender(template, context);
}

export { renderTemplate };
