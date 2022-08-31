// @ts-check

const { getTsconfigPath } = require("@strangelovelabs/style-guide/eslint/helpers");

/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
  extends: [
    require.resolve("@strangelovelabs/style-guide/eslint/node"),
    require.resolve("@strangelovelabs/style-guide/eslint/typescript"),
  ],
  ignorePatterns: ["dist", "node_modules"],
  parserOptions: {
    project: getTsconfigPath(),
  },
  overrides: [
    {
      files: ["tsup.config.{js,ts}"],
      rules: {
        "import/no-default-export": ["off"],
      },
    },
  ],
  root: true,
};

module.exports = eslintConfig;
