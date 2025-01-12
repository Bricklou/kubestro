import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default [
  // JavaScript config
  { files: ['eslint.config.mjs', 'projects/libraries/design-system/**.m?js'] },
  pluginJs.configs.recommended,
  stylistic.configs.customize({
    jsx: true,
    flat: true,
  }),
  {
    plugins: {
      '@stylistic': stylistic,
      'eslint': pluginJs,
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
]
