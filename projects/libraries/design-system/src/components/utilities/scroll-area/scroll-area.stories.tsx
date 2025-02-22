import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea } from './scroll-area'
import { Separator } from '@/components/layout/separator'

const meta: Meta<typeof ScrollArea> = {
  title: 'Utilities/ScrollArea',
  component: ScrollArea,
  decorators: [
    Story => (
      <div className="p-8">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof ScrollArea>

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${(a.length - i).toString()}`
)

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border border-border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>

        {tags.map(tag => (
          <>
            <div className="text-sm" key={tag}>
              {tag}
            </div>

            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}
