import type { Meta, StoryObj } from '@storybook/react'
import { withActions } from '@storybook/addon-actions/decorator'
import { Label } from '../label/label'
import { Checkbox } from './checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  args: {
    checked: false,
    disabled: false
  },
  argTypes: {
    id: { control: { disable: true } }
  },
  parameters: {
    actions: {
      handles: ['change']
    }
  },
  decorators: [
    withActions,
    Story => (
      <div className="p-8">
        <div className="flex items-center space-x-2">
          <Story />
          <Label htmlFor="checkbox">Checkbox</Label>
        </div>
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof Checkbox>

const Template: Story = {
  args: {
    id: 'checkbox'
  }
}

export const Unchecked: Story = {
  args: {
    ...Template.args,
    checked: false
  }
}

export const Checked: Story = {
  args: {
    ...Template.args,
    checked: true
  }
}

export const Disabled: Story = {
  args: {
    ...Template.args,
    checked: true,
    disabled: true
  }
}
