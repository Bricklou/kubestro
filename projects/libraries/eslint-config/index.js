import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import stylistic from "@stylistic/eslint-plugin";
import jsxA11y from "eslint-plugin-jsx-a11y";

/**
 * Configures ESLint to use an opinionated config tailored for
 * creating a Typescript & React application.
 *
 * You may pass additional config blocks as multiple arguments
 * to this function.
 *
 * @example
 * ```js
 * configApp()
 *
 * configApp({
 *   files: ['src/**\/*.ts'],
 *   ignore: ['dist'],
 *   rules: {
 *   }
 * })
 * ````
 *
 * @param  {import('typescript-eslint').ConfigWithExtends[]} configBlockToMerge
 */
export function configApp(...configBlockToMerge) {
  return tseslint.config(
    // Ignore the build output directory
    { ignores: ["dist"] },

    // Typescript & React config
    {
      extends: [
        pluginJs.configs.recommended,
        tseslint.configs.strictTypeChecked,
        pluginReact.configs.flat.recommended,
        jsxA11y.flatConfigs.recommended,
        stylistic.configs.customize({
          jsx: true,
          flat: true,
        }),
      ],
      files: ["**/*.{ts,jsx,tsx}"],
      languageOptions: {
        parserOptions: {
          ecmaVersion: "latest",
          ecmaFeatures: {
            jsx: true,
          },
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
        globals: {
          ...globals.browser,
          ...globals.es2024,
        },
      },
      plugins: {
        react: pluginReact,
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
        ],
      },
    },
    ...configBlockToMerge,
  );
}
