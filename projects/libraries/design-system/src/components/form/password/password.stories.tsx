import type { Meta, StoryObj } from '@storybook/react'
import { PasswordVerification } from './password'

const meta: Meta<typeof PasswordVerification> = {
  title: 'Base/PasswordVerification',
  component: PasswordVerification,
  decorators: [
    Story => (
      <div className="p-8">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof PasswordVerification>

export const Default: Story = {}
