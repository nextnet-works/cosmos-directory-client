// @ts-check

const { getTsconfigPath } = require("@grikomsn/style-guide/eslint/helpers");

const ignoredFilenames = ["chain", "chains", "chain-validators", "status", "validator", "validators"];

/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
  extends: [
    require.resolve("@grikomsn/style-guide/eslint/node"),
    require.resolve("@grikomsn/style-guide/eslint/typescript"),
  ],
  ignorePatterns: [
    "node_modules",
    ...ignoredFilenames.reduce((arr, filename) => arr.concat(`${filename}.js`, `${filename}.ts`), [""]),
  ],
  parserOptions: {
    project: getTsconfigPath(),
  },
  root: true,
};

module.exports = eslintConfig;
