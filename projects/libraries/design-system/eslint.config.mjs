import { configApp } from 'eslint-config-kubestro'
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
  }
)
