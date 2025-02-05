import { configApp } from '@kubestro/eslint-config'
import pluginStorybook from 'eslint-plugin-storybook'

export default configApp(
  import.meta.dirname,
  {
    files: ['.storybook/**/*.{ts,tsx}', 'src/**/*.stories.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.storybook.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      storybook: pluginStorybook
    }
  },
  {
    files: ['src/**/*.stories.{ts,tsx}'],
    extends: [pluginStorybook.configs['flat/recommended']]
  }
)
