import type { Meta, StoryObj } from '@storybook/react'
import { withActions } from '@storybook/addon-actions/decorator'

import { LucideSmile } from 'lucide-react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'Base/Button',
  component: Button,
  args: {
    variant: 'primary',
    disabled: false,
    type: 'button',
    size: 'md',
    loading: false
  },
  parameters: {
    actions: {
      handles: ['click']
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset']
    },
    icon: {
      control: 'radio',
      options: ['None', 'LucideSmile'],
      mapping: {
        None: undefined,
        LucideSmile: <LucideSmile className="size-4" />
      }
    },
    asChild: { control: { disable: true } }
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
type Story = StoryObj<typeof Button>

const Template: Story = {
  args: {
    children: 'Button'
  }
}

export const Primary: Story = {
  args: {
    ...Template.args
  }
}

export const Loading: Story = {
  args: {
    ...Template.args,
    loading: true
  }
}

export const Disabled: Story = {
  args: {
    ...Template.args,
    disabled: true
  }
}

export const Icon: Story = {
  args: {
    ...Template.args,
    icon: <LucideSmile className="size-4" />
  }
}
