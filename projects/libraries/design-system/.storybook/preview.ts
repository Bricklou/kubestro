import type { Preview, ReactRenderer } from '@storybook/react'
import '../public/tw-preset.css'
import '@fontsource-variable/inter'
import { withThemeByDataAttribute } from '@storybook/addon-themes'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      toc: true
    },
    options: {
      storySort: {
        order: ['Getting Started', 'Colors', 'Base', '*']
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        light: 'light',
        dark: 'dark'
      },
      defaultTheme: 'light',
      attributeName: 'data-theme'
    })
  ]
}

export default preview
