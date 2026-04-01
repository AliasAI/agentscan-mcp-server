import { defineConfig } from "vitest/config";
import { resolve, dirname } from "path";
import { existsSync } from "fs";

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
    exclude: ["node_modules", "dist"],
  },
  resolve: {
    conditions: ["node"],
  },
  plugins: [
    {
      name: "resolve-ts-from-js",
      resolveId(source, importer) {
        if (!source.endsWith(".js") || !importer || source.includes("node_modules")) {
          return null;
        }
        const tsPath = resolve(dirname(importer), source.replace(/\.js$/, ".ts"));
        if (existsSync(tsPath)) {
          return tsPath;
        }
        return null;
      },
    },
  ],
});
