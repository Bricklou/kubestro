import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './skeleton'
import { skeletonVariant } from './style'

const meta: Meta<typeof Skeleton> = {
  title: 'Utilities/Skeleton',
  component: Skeleton,
  decorators: [
    Story => (
      <div className="p-8">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => (
    <div className="flex flex-col">
      <div className="bg-background gap-4 p-8">
        <div className="w-96">
          <Skeleton className="h-4 w-[40%]" />

          <ul className="mt-5 space-y-3">
            {[1, 2, 3].map(i => (
              <li className={skeletonVariant({ className: 'w-full h-4' })} key={i} />
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-background gap-4 p-8" data-theme="dark">
        <div className="w-96">
          <Skeleton className="h-4 w-[40%]" />

          <ul className="mt-5 space-y-3">
            {[1, 2, 3].map(i => (
              <li className={skeletonVariant({ className: 'w-full h-4' })} key={i} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
