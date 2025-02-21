import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import type { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { Button } from '../button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Base/DropdownMenu',
  component: DropdownMenu,
  decorators: [
    Story => (
      <div className="p-8">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

type Checked = DropdownMenuCheckboxItemProps['checked']
export const Default: Story = {
  render: () => {
    const [showStatusBar, setShowStatusBar] = useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = useState<Checked>(false)
    const [showPanel, setShowPanel] = useState<Checked>(false)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Open</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuCheckboxItem
            checked={showStatusBar}
            onCheckedChange={setShowStatusBar}
          >
            Status Bar
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={showActivityBar}
            disabled
            onCheckedChange={setShowActivityBar}
          >
            Activity Bar
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={showPanel}
            onCheckedChange={setShowPanel}
          >
            Panel
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
