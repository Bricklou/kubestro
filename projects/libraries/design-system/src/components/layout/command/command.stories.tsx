import type { Meta, StoryObj } from '@storybook/react'
import { Calendar, Smile, Calculator, User, CreditCard, Settings } from 'lucide-react'
import React from 'react'
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from './command'

const meta: Meta<typeof Command> = {
  title: 'Layout/Command',
  component: Command,
  decorators: [
    Story => (
      <Story />
    )
  ]
}

export default meta
type Story = StoryObj<typeof Command>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
      const controller = new AbortController()
      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen(op => !op)
        }
      }, { signal: controller.signal })

      return () => {
        controller.abort()
      }
    }, [])

    return (
      <>
        <p className="text-sm text-muted-foreground">
          Press
          {' '}

          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>
        </p>

        <CommandDialog onOpenChange={setOpen} open={open}>
          <CommandInput placeholder="Type a command or search..." />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Calendar />
                <span>Calendar</span>
              </CommandItem>

              <CommandItem>
                <Smile />
                <span>Search Emoji</span>
              </CommandItem>

              <CommandItem>
                <Calculator />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Settings">
              <CommandItem>
                <User />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>

              <CommandItem>
                <CreditCard />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>

              <CommandItem>
                <Settings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    )
  }
}
