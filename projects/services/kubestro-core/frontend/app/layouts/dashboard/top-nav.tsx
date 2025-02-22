import { Button } from '@kubestro/design-system'
import { DropdownMenu, DropdownMenuTrigger } from '@kubestro/design-system/components'
import { MenuIcon } from 'lucide-react'
import type { HTMLAttributes } from 'react'

export function TopNav({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <div className="md:hidden">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MenuIcon />
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  )
}
