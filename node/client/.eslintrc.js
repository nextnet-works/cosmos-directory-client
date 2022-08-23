// @ts-check

const { getTsconfigPath } = require("@grikomsn/style-guide/eslint/helpers");

/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
  extends: [
    require.resolve("@grikomsn/style-guide/eslint/node"),
    require.resolve("@grikomsn/style-guide/eslint/typescript"),
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
