import type { Meta, StoryObj } from '@storybook/react'
import { withActions } from '@storybook/addon-actions/decorator'

import { LucideSmile } from 'lucide-react'
import { Button } from './button'
import { buttonVariants } from './style'

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
    variant: {
      control: 'radio',
      options: Object.keys(buttonVariants.variants.variant)
    },
    icon: {
      control: 'radio',
      options: ['None', 'LucideSmile'],
      mapping: {
        None: undefined,
        LucideSmile
      }
    },
    effect: {
      control: 'select',
      options: [undefined, ...Object.keys(buttonVariants.variants.effect)]
    },
    iconPlacement: {
      control: 'select',
      options: [undefined, 'left', 'right']
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

export const All: Story = {
  args: {
    ...Template.args
  },
  render: () => (
    <>
      <div className="flex gap-4 p-8 bg-background">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      <div className="flex gap-4 p-8 bg-background" data-theme="dark">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </>
  )
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
    icon: LucideSmile,
    iconPlacement: 'left'
  }
}
