import { withActions } from '@storybook/addon-actions/decorator'
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Form/Input',
  args: {
    disabled: false,
    type: 'text',
    placeholder: 'Example placeholder'
  },
  parameters: {
    actions: {
      handles: ['change', 'input']
    }
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Default HTML input attributes'
    },
    type: {
      control: 'select',
      options: ['text', 'number', 'password'],
      description: 'Default HTML input attributes'
    },
    placeholder: { description: 'Default HTML input attributes' }
  },
  decorators: [
    withActions,
    Story => (
      <div className="p-8">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof Input>

const Template: Story = {
  args: {
    disabled: false,
    type: 'text'
  }
}

export const Default: Story = {
  args: {
    ...Template.args
  }
}

export const Placeholder: Story = {
  args: {
    ...Template.args,
    placeholder: 'Placeholder'
  }
}

export const Disabled: Story = {
  args: {
    ...Template.args,
    disabled: true
  }
}
