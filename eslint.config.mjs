import globals from "globals";
import pluginJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

export default [
  // JavaScript config
  {
    files: ["eslint.config.mjs", "projects/libraries/design-system/**.m?js"],
    plugins: {
      "@stylistic": stylistic,
      eslint: pluginJs,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2024,
      },
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },
  },
];
