/* eslint-disable react/jsx-no-bind */
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../button'
import { Toaster } from './toaster'
import { useToast } from './use-toast'

const meta: Meta<typeof Toaster> = {
  component: Toaster,
  title: 'Base/Toaster',
  decorators: [
    Story => (
      <div className="p-4">
        <Story />
        <Toaster />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof Toaster>

function Template({
  onClick
}: { readonly onClick: (toast: ReturnType<typeof useToast>['toast']) => void }) {
  const { toast } = useToast()

  return <Button onClick={() => { onClick(toast) }}>Default</Button>
}

export const Default: Story = {
  render: () => (
    <Template
      onClick={(toast) => {
        toast({
          title: 'Default message'
        })
      }}
    />
  )
}

export const Description: Story = {
  render: () => (
    <Template
      onClick={(toast) => {
        toast({
          title: 'Description message',
          description: 'Description'
        })
      }}
    />
  )
}

export const Success: Story = {
  render: () => (
    <Template
      onClick={(toast) => {
        toast({
          title: 'Success message',
          variant: 'success'
        })
      }}
    />
  )
}

export const Info: Story = {
  render: () => (
    <Template
      onClick={(toast) => {
        toast({
          title: 'Info message',
          variant: 'info'
        })
      }}
    />
  )
}

export const Warning: Story = {
  render: () => (
    <Template
      onClick={(toast) => {
        toast({
          title: 'Warning message',
          variant: 'warning'
        })
      }}
    />
  )
}

export const Error: Story = {
  render: () => (
    <Template
      onClick={(toast) => {
        toast({
          title: 'Error message',
          variant: 'error'
        })
      }}
    />
  )
}

export const Action: Story = {
  render: () => (
    <Template
      onClick={(toast) => {
        toast({
          title: 'Action message'
        })
      }}
    />
  )
}
