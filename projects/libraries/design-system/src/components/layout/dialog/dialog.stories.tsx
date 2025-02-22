import type { Meta, StoryObj } from '@storybook/react'
import { Copy } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Button } from '@/components/base/button'
import { Input, Label } from '@/components/form'

const meta: Meta<typeof Dialog> = {
  title: 'Layout/Dialog',
  component: Dialog,
  decorators: [
    Story => (
      <Story />
    )
  ]
}

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary-soft">Share</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>

          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label className="sr-only" htmlFor="link">
              Link
            </Label>

            <Input
              defaultValue="https://ui.shadcn.com/docs/installation"
              id="link"
              readOnly
            />
          </div>

          <Button className="px-3" size="sm" type="submit">
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
