import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import stylistic from '@stylistic/eslint-plugin'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tailwindcss from 'eslint-plugin-tailwindcss'

/**
 * Configures ESLint to use an opinionated config tailored for
 * creating a Typescript & React application.
 *
 * You may pass additional config blocks as multiple arguments
 * to this function.
 *
 * @example
 * ```js
 * configApp(import.meta.dirname)
 *
 * configApp(import.meta.dirname, {
 *   files: ['src/**\/*.ts'],
 *   ignore: ['dist'],
 *   rules: {
 *   }
 * })
 * ````
 *
 * @param  {string} rootDir Path to the root directory of the project
 * @param  {import('typescript-eslint').ConfigWithExtends[]} configBlockToMerge Additional config blocks to merge
 */
export function configApp(rootDir, ...configBlockToMerge) {
  return tseslint.config(
    // Ignore the build output directory
    { ignores: ['dist'] },
    // Ignore unwanted files
    { ignores: ['**/node_modules/**', '**/eslint.config.mjs', '**/stylelint.config.mjs'] },
    { files: ['**/*.{ts,jsx,tsx,mjs}'] },

    pluginJs.configs.recommended,
    tseslint.configs.strictTypeChecked,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat['jsx-runtime'],
    jsxA11y.flatConfigs.recommended,
    stylistic.configs.customize({
      jsx: true,
      flat: true,
    }),
    ...tailwindcss.configs['flat/recommended'],

    {
      plugins: {
        'eslint': pluginJs,
        'react': pluginReact,
        'react-hooks': reactHooks,
      },
    },

    {
      languageOptions: {
        parserOptions: {
          ecmaVersion: 'latest',
          ecmaFeatures: {
            jsx: true,
          },
          projectService: true,
          tsconfigRootDir: rootDir,
        },
        globals: {
          ...globals.browser,
          ...globals.es2024,
        },
      },
    },
    {
      rules: {
        ...reactHooks.configs.recommended.rules,
      },
    },
    {
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    ...configBlockToMerge,
  )
}
