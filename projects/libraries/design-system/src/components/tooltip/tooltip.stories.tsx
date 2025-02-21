import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Utilities/Tooltip',
  component: Tooltip,
  decorators: [
    Story => (
      <div className="p-8">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover</TooltipTrigger>

        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
