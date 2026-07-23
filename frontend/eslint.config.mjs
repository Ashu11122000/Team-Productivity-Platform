import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import tanstackQueryPlugin from "@tanstack/eslint-plugin-query";

const eslintConfig = defineConfig([
  ...nextCoreWebVitals,

  ...nextTypeScript,

  ...tanstackQueryPlugin.configs["flat/recommended"],

  {
    rules: {
      "react/jsx-key": "error",

      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
    },
  },

  globalIgnores([
    ".next/**",

    "out/**",

    "build/**",

    "coverage/**",

    "dist/**",

    ".turbo/**",

    "playwright-report/**",

    "test-results/**",

    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
