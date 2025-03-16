import { withActions } from '@storybook/addon-actions/decorator'
import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './textarea'

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  title: 'Form/Textarea',
  args: {
    disabled: false,
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
type Story = StoryObj<typeof Textarea>

const Template: Story = {
  args: {
    disabled: false
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
