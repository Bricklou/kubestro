import type { Meta, StoryObj } from '@storybook/react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet'
import { Button } from '@/components/base/button'
import { Input, Label } from '@/components/form'

const meta: Meta<typeof Sheet> = {
  title: 'Layout/Sheet',
  component: Sheet,
  decorators: [
    Story => (
      <Story />
    )
  ]
}

export default meta
type Story = StoryObj<typeof Sheet>

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const

export const Default: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2">
      {SHEET_SIDES.map(side => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="primary-soft">{side}</Button>
          </SheetTrigger>

          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>

              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="name">
                  Name
                </Label>

                <Input className="col-span-3" id="name" value="Pedro Duarte" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="username">
                  Username
                </Label>

                <Input className="col-span-3" id="username" value="@peduarte" />
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
