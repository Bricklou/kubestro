import { Badge, Collapsible, CollapsibleContent, CollapsibleTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, SidebarGroup, SidebarGroupAction, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, Tooltip, TooltipContent, TooltipTrigger, useSidebar } from '@kubestro/design-system/components'
import { Link, useLocation } from 'react-router'
import { useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import type { NavCollapsible, NavGroup, NavItem, NavLink } from './sidebar-data'

function useActive(item: NavItem, mainNav = false) {
  const { pathname } = useLocation()

  // Early return for exact match
  if (pathname === item.to) {
    return true
  }

  // Only split pathname once, and only if needed
  const [currentPath] = pathname.split('?')
  if (currentPath === item.to) {
    return true
  }

  // Check child items - avoid this computation if no items exist
  if (item.items?.length) {
    if (item.items.some(i => i.to === pathname)) {
      return true
    }
  }

  // Only check main section if mainNav is true
  if (mainNav) {
    const [, mainSection] = pathname.split('/')
    if (mainSection && item.to) {
      return mainSection === item.to.split('/')[1]
    }
  }

  return false
}

function NavBadge({ children }: { readonly children: ReactNode }) {
  return <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
}

interface SidebarMenuLinkProps {
  readonly item: NavLink
}

function SidebarMenuLink({ item }: SidebarMenuLinkProps) {
  const { setOpenMobile } = useSidebar()
  const active = useActive(item)

  const handleClick = useCallback(() => { setOpenMobile(false) }, [setOpenMobile])

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={item.title}
      >
        <Link onClick={handleClick} to={item.to}>
          {item.icon ? <item.icon /> : null}
          <span>{item.title}</span>
          {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

interface SidebarMenuCollapsibleProps {
  readonly item: NavCollapsible
}

interface SidebarMenuCollapsibleItemProps {
  readonly item: SidebarMenuCollapsibleProps['item']['items'][0]
}

function SidebarMenuCollapsibleItem({ item }: SidebarMenuCollapsibleItemProps) {
  const active = useActive(item)
  return (
    <SidebarMenuSubItem key={item.title}>
      <SidebarMenuButton asChild isActive={active}>
        <Link to={item.to}>
          {item.icon ? <item.icon /> : null}
          <span>{item.title}</span>
          {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuSubItem>
  )
}

function SidebarMenuCollapsible({ item }: SidebarMenuCollapsibleProps) {
  const active = useActive(item, true)
  return (
    <Collapsible asChild className="group/collapsible" defaultOpen={active}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon ? <item.icon /> : null}
            <span>{item.title}</span>
            {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map(subItem => (
              <SidebarMenuCollapsibleItem item={subItem} key={subItem.title} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

interface SidebarMenuCollapsedDropdownProps {
  readonly item: NavCollapsible
}

interface SidebarMenuCollapsedDropdownItemProps {
  readonly item: SidebarMenuCollapsedDropdownProps['item']['items'][0]
}

function SidebarMenuCollapsedDropdownItem({ item }: SidebarMenuCollapsedDropdownItemProps) {
  const active = useActive(item)
  return (
    <DropdownMenuItem asChild>
      <Link className={active ? 'bg-secondary' : ''} to={item.to}>
        {item.icon ? <item.icon /> : null}
        <span>{item.title}</span>
        {item.badge ? <span className="ml-auto text-xs">{item.badge}</span> : null}
      </Link>
    </DropdownMenuItem>
  )
}

function SidebarMenuCollapsedDropdown({ item }: SidebarMenuCollapsedDropdownProps) {
  const active = useActive(item)
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            isActive={active}
            tooltip={item.title}
          >
            {item.icon ? <item.icon /> : null}
            <span>{item.title}</span>
            {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" side="right" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {item.items.map(sub => (
            <SidebarMenuCollapsedDropdownItem item={sub} key={sub.title} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

export function NavGroup({ title, action, items }: NavGroup) {
  const { state } = useSidebar()

  const groupAction = useMemo(() => {
    if (!action) return null

    let el: ReactNode
    if (action.to) {
      el = (
        <SidebarGroupAction asChild>
          <Link to={action.to}>
            <action.icon />
            <span className="sr-only">{action.title}</span>
          </Link>
        </SidebarGroupAction>
      )
    }
    else {
      el = (
        <SidebarGroupAction onClick={action.onClick}>
          <action.icon />
          <span className="sr-only">{action.title}</span>
        </SidebarGroupAction>
      )
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {el}
        </TooltipTrigger>

        <TooltipContent side="right">
          {action.title}
        </TooltipContent>
      </Tooltip>
    )
  }, [action])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {title}
        {groupAction}
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const key = item.to ? `${item.title}-${item.to}` : item.title

          if (!item.items) return <SidebarMenuLink item={item} key={key} />

          if (state === 'collapsed') return <SidebarMenuCollapsedDropdown item={item} key={key} />

          return <SidebarMenuCollapsible item={item} key={key} />
        })}
      </SidebarMenu>
    </SidebarGroup >
  )
}
