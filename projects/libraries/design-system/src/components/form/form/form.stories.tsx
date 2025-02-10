import type { Meta, StoryObj } from '@storybook/react'
import { FormMessage } from './form'

const meta: Meta<typeof FormMessage> = {
  component: FormMessage,
  title: 'Form/FormMessage'
}

export default meta
type Story = StoryObj<typeof FormMessage>

export const Default: Story = {
  args: {
    children: 'My Label'
  }
}
