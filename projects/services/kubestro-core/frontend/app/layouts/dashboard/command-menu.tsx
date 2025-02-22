import { useTheme } from '@kubestro/design-system/hooks'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, ScrollArea } from '@kubestro/design-system/components'
import { useCallback } from 'react'
import { LaptopIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useSearch } from '~/hooks/search'

export function CommandMenu() {
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [setOpen])

  const switchLight = useCallback(() => { runCommand(() => { setTheme('light') }) }, [runCommand, setTheme])
  const switchDark = useCallback(() => { runCommand(() => { setTheme('dark') }) }, [runCommand, setTheme])
  const switchSystem = useCallback(() => { runCommand(() => { setTheme('system') }) }, [runCommand, setTheme])

  return (
    <CommandDialog modal onOpenChange={setOpen} open={open}>
      <CommandInput placeholder="Type a command or search..." />

      <CommandList>
        <ScrollArea className="h-72 pr-1" type="hover">
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandSeparator />

          <CommandGroup heading="Theme">
            <CommandItem onSelect={switchLight}>
              <SunIcon />
              <span>Light</span>
            </CommandItem>

            <CommandItem onSelect={switchDark}>
              <MoonIcon />
              <span>Dark</span>
            </CommandItem>

            <CommandItem onSelect={switchSystem}>
              <LaptopIcon />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
