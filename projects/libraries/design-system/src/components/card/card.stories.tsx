import type { Meta, StoryObj } from '@storybook/react'
import { BellRing, Check } from 'lucide-react'
import { Button } from '../button'
import { Switch } from '../form/switch'
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from './card'

const meta: Meta<typeof Card> = {
  title: 'Layout/Card',
  component: Card,
  decorators: [
    Story => (
      <div className="p-8">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>

      <CardContent>
        <p>Card content</p>
      </CardContent>

      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}

const notifications = [
  {
    title: 'Your call has been confirmed.',
    description: '1 hour ago'
  },
  {
    title: 'You have a new message!',
    description: '1 hour ago'
  },
  {
    title: 'Your subscription is expiring soon!',
    description: '2 hours ago'
  }
]
export const Demo: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <BellRing />

          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>

            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>

          <Switch />
        </div>

        <div>
          {notifications.map((notification, index) => (
            <div
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              key={index}
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />

              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                </p>

                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full">
          <Check /> Mark all as read
        </Button>
      </CardFooter>
    </Card>
  )
}
