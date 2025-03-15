import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'Layout/Badge',
  component: Badge,
  decorators: [
    Story => (
      <div className="p-8">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof Badge>

export const All: Story = {
  render: () => (
    <>
      <div className="flex gap-4 p-8 bg-background">
        <Badge variant="primary">Primary</Badge>
        <Badge variant="primary-soft">Primary Soft</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>

      <div className="flex gap-4 p-8 bg-background" data-theme="dark">
        <Badge variant="primary">Primary</Badge>
        <Badge variant="primary-soft">Primary Soft</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </>
  )
}
