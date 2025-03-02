import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@kubestro/design-system'
import { useTheme } from '@kubestro/design-system/hooks/theme'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useCallback } from 'react'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  const switchLight = useCallback(() => { setTheme('light') }, [setTheme])
  const switchDark = useCallback(() => { setTheme('dark') }, [setTheme])
  const switchSystem = useCallback(() => { setTheme('system') }, [setTheme])

  return (
    <>
      <meta content={theme === 'dark' ? '#0f100f' : '#fff'} name="theme-color" />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className="scale-95 rounded-full" size="icon" variant="ghost">
            <SunIcon className="rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem checked={theme === 'light'} onCheckedChange={switchLight}>
            Light
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem checked={theme === 'dark'} onCheckedChange={switchDark}>
            Dark
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem checked={theme === 'system'} onCheckedChange={switchSystem}>
            System
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
