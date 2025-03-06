import { Avatar, AvatarFallback, Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@kubestro/design-system/components'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Form, href, Link } from 'react-router'
import type { User } from '~/data/types/user'

function LogoutItem() {
  return (
    <Form action={href('/logout')} method="post">
      <DropdownMenuItem asChild className="w-full">
        <button type="submit" value="logout">
          <LogOutIcon />
          Log out
        </button>
      </DropdownMenuItem>
    </Form>
  )
}

interface ProfileDropdownProps {
  readonly user: User
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  // Generate a string from initials of the user's username
  const initials = useMemo(() => user.username.split(' ').map(name => name[0])
    .join(''), [user.username])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="relative size-10 rounded-full hover:ring-2 hover:ring-secondary-hover transition-shadow data-[state=open]:ring-2 data-[state=open]:ring-offset-2 data-[state=open]:ring-primary" variant="ghost">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary text-primary-text hover:bg-primary-hover transition-colors">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to={href('/dashboard/settings')}>
            <SettingsIcon />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <LogoutItem />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
