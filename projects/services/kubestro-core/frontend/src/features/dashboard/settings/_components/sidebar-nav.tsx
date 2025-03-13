import { buttonVariants, ScrollArea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kubestro/design-system'
import { useCallback, useState } from 'react'
import type { HTMLAttributes, ReactElement } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { twJoin, twMerge } from 'tailwind-merge'

export interface SidebarNavItem {
  readonly to: string
  readonly title: string
  readonly icon: ReactElement
}

interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  readonly items: SidebarNavItem[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [val, setVal] = useState(pathname)

  const handleSelect = useCallback((e: string) => {
    setVal(e)
    void navigate(e)
  }, [setVal, navigate])

  return (
    <>
      <div className="p-1 md:hidden">
        {/* Mobile menu button */}
        <Select onValueChange={handleSelect} value={val}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>

          <SelectContent>
            {items.map(item => (
              <SelectItem key={item.to} value={item.to}>
                <div className="flex gap-x-4 px-2 py-1">
                  <span className="scale-125">{item.icon}</span>
                  <span className="text-md">{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea
        className="hidden w-full min-w-40 bg-background px-1 py-2 md:block"
        orientation="horizontal"
        type="always"
      >
        {/* Content */}
        <nav className={twMerge('flex space-x-2 py-1 lg:flex-col lg:space-x-0 lg:space-y-1', className)} {...props}>
          {items.map(item => (
            <Link
              className={buttonVariants({
                variant: pathname === item.to ? 'primary-soft' : 'ghost',
                className: twJoin(pathname === item.to ? 'hover:bg-primary-soft' : 'text-text', 'justify-start')
              })}
              key={item.to}
              to={item.to}
            >
              <span className="mr-2">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  )
}
