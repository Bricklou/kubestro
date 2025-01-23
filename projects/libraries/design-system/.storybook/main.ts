import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-themes'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  typescript: {

    /*
     * WARN: description generation is broken when using PNPM, see
     * https://github.com/storybookjs/storybook/discussions/23209
     */
    reactDocgen: 'react-docgen-typescript',
    check: true
  }
}
export default config
