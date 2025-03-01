import { useTheme } from '@kubestro/design-system/hooks'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, ScrollArea } from '@kubestro/design-system/components'
import { useCallback } from 'react'
import { ArrowRight, LaptopIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { sidebarData } from './sidebar-data'
import { useSearch } from '~/hooks/search'

export function CommandMenu() {
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()
  const navigate = useNavigate()

  const makeCommand = useCallback(
    <T extends unknown[]>(command: (...args: T) => unknown, ...args: T) => {
      return () => {
        setOpen(false)
        command(...args)
      }
    },
    [setOpen]
  )

  const switchLight = makeCommand(setTheme, 'light')
  const switchDark = makeCommand(setTheme, 'dark')
  const switchSystem = makeCommand(setTheme, 'system')

  const onItemSelect = useCallback((url: string) => {
    return () => {
      setOpen(false)
      void navigate(url)
    }
  }, [navigate, setOpen])

  return (
    <CommandDialog modal onOpenChange={setOpen} open={open}>
      <CommandInput placeholder="Type a command or search..." />

      <CommandList>
        <ScrollArea className="h-72 pr-1" type="hover">
          <CommandEmpty>No result found.</CommandEmpty>

          {sidebarData.navGroups.map(group => (
            <CommandGroup heading={group.title} key={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.to) {
                  return (
                    <CommandItem
                      key={`${navItem.to}-${i.toString()}`}
                      onSelect={onItemSelect(navItem.to)}
                      value={navItem.title}
                    >
                      <div className="mr-2 flex size-4 items-center justify-center">
                        {navItem.icon ? <navItem.icon className="size-2" /> : <ArrowRight className="size-2" />}
                      </div>

                      {navItem.title}
                    </CommandItem>
                  )
                }

                return navItem.items?.map((subItem, j) => (
                  <CommandItem
                    key={`${subItem.to}-${j.toString()}`}
                    onSelect={onItemSelect(subItem.to)}
                    value={subItem.title}
                  >
                    <div className="mr-2 flex size-4 items-center justify-center">
                      {subItem.icon ? <subItem.icon className="size-2" /> : <ArrowRight className="size-2" />}
                    </div>

                    {subItem.title}
                  </CommandItem>
                ))
              })}
            </CommandGroup>
          ))}

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
