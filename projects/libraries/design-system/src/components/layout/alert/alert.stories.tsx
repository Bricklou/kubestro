import type { Meta, StoryObj } from '@storybook/react'
import { AlertCircleIcon, AlertTriangleIcon, TerminalIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './alert'

const meta: Meta<typeof Alert> = {
  title: 'Layout/Alert',
  component: Alert,
  decorators: [
    Story => (
      <div className="p-8">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert>
      <TerminalIcon className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>

      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  )
}

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTriangleIcon className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>

      <AlertDescription>
        You are about to delete this item. Are you sure?
      </AlertDescription>
    </Alert>
  )
}

export const Danger: Story = {
  render: () => (
    <Alert variant="danger">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>

      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  )
}
