import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import _import from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/*.svg", "dist/", "storybook-static/"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
  },
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ),
  ),
  {
    env: {
      browser: true,
      node: true,
    },
    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      prettier,
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      parser: tsParser,
    },

    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx", ".js", ".jsx"],
      },

      "import/resolver": {
        typescript: {},
      },
    },

    rules: {
      "@typescript-eslint/no-explicit-any": 1,
      "no-console": 0,
      "prettier/prettier": 2,

      "import/no-cycle": [
        2,
        {
          ignoreExternal: true,
        },
      ],

      "import/no-duplicates": [
        "error",
        {
          considerQueryString: true,
        },
      ],

      "@typescript-eslint/no-import-type-side-effects": "error",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],

      "import/default": 0,
    },
  },
];
