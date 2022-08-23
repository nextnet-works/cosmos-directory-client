import { defineConfig } from "tsup";

import { dependencies } from "./package.json";

export default defineConfig(({ watch }) => ({
  clean: !watch,
  dts: true,
  entry: ["src/*.ts"],
  external: [...Object.keys(dependencies)],
  format: ["cjs", "esm"],
  minify: !watch,
  minifyIdentifiers: !watch,
  minifySyntax: !watch,
  minifyWhitespace: !watch,
}));
