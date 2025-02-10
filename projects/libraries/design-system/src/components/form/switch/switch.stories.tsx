import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '../label'
import { Switch } from './switch'

const meta: Meta<typeof Switch> = {
  title: 'Form/Switch',
  component: Switch,
  decorators: [
    Story => (
      <div className="p-8">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
