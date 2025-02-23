import type { ComponentProps, CSSProperties, HTMLAttributes, RefAttributes, MouseEvent } from 'react'
import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { PanelLeft } from 'lucide-react'
import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../utilities/tooltip/tooltip'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '../sheet/sheet'
import { Button } from '../../base/button'
import { Input } from '../../form/input'
import { Separator } from '../separator'
import { Skeleton } from '../../utilities/skeleton'
import { useMediaQuery } from '@/hooks/media-query'

interface SidebarContext {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContext | null>(null)

export function useSidebar() {
  const context = use(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }
  return context
}

interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement>,
  RefAttributes<HTMLDivElement> {
  readonly defaultOpen?: boolean
  readonly open?: boolean
  readonly onOpenChange?: (open: boolean) => void
}

const SIDEBAR_KEYBOARD_SHORTCUT = 'b'
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'

export function SidebarProvider({
  defaultOpen = false,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ref,
  ...props
}: SidebarProviderProps) {
  const isDesktop = useMediaQuery('md')
  const [openMobile, setOpenMobile] = useState(false)

  // Read initial value from localStorage
  const lsValue = localStorage.getItem('sidebarOpen')
  const initialState = lsValue === 'true' || (lsValue !== 'false' && defaultOpen)

  /*
   * This is the internal state of the sidebar
   * We use openProp and setOpenProp for control from outside the component.
   */
  const [open_internal, setOpen_internal] = useState(initialState)
  const open = openProp ?? open_internal
  const setOpen = useCallback((value: boolean | ((value: boolean) => boolean)) => {
    const openState = typeof value === 'function' ? value(open) : value
    if (setOpenProp) {
      setOpenProp(openState)
    }
    else {
      setOpen_internal(openState)
    }

    // This sets the state to keep the sidebar state
    localStorage.setItem('sidebarOpen', openState ? 'true' : 'false')
  }, [setOpenProp, open])

  // Helper to toggle the sidebar
  const toggleSidebar = useCallback(() => {
    if (isDesktop) {
      setOpen(value => !value)
    }
    else {
      setOpenMobile(value => !value)
    }
  }, [isDesktop, setOpen, setOpenMobile])

  useEffect(() => {
    const controller = new AbortController()
    window.addEventListener('keydown', (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }, { signal: controller.signal })

    return () => {
      controller.abort()
    }
  }, [toggleSidebar])

  /*
   * We add a state so that we can do `data-state="expanded"` or `data-state="collapsed"`.
   * This makes it easier to style the sidebar with Tailwind classes.
   */
  const state = open ? 'expanded' : 'collapsed'

  const contextValue = useMemo<SidebarContext>(() => ({
    state,
    open,
    setOpen,
    isMobile: !isDesktop,
    openMobile,
    setOpenMobile,
    toggleSidebar
  }), [
    state,
    open,
    setOpen,
    isDesktop,
    openMobile,
    setOpenMobile,
    toggleSidebar
  ])

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          className={twMerge(
            'group/sidebar-wrapper flex min-h-svh w-full data-[variant=inset]:bg-background',
            className
          )}
          ref={ref}
          style={{
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style
          } as CSSProperties}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends ComponentProps<'div'> {
  readonly side?: 'left' | 'right'
  readonly variant?: 'sidebar' | 'floating' | 'inset'
  readonly collapsible?: 'offcanvas' | 'icon' | 'none'
}

export function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  children,
  className,
  ref,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === 'none') {
    return (
      <div
        className={twMerge(
          'flex h-full w-(--sidebar-width) flex-col bg-sidebar-background text-text',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile} {...props}>
        <SheetTitle className="sr-only" />

        <SheetContent
          className="w-(--sidebar-width) bg-sidebar-background p-0 text-text [&>button]:hidden"
          data-mobile="true"
          data-sidebar="sidebar"
          side={side}
          style={{
            // @ts-expect-error -- Since this is a CSS variable, it is still valid.
            '--sidebar-width': SIDEBAR_WIDTH_MOBILE
          }}
        >
          <SheetDescription className="sr-only" />
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer hidden text-sidebar-text md:block"
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-side={side}
      data-state={state}
      data-variant={variant}
      ref={ref}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={twMerge(
          'relative h-svh w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset' ?
            'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]' :
            'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
        )}
      />

      <div
        className={twMerge(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left' ?
            'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]' :
            'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset' ?
            'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]' :
            'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className
        )}
        {...props}
      >
        <div
          className="flex h-full w-full flex-col bg-sidebar-background group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          data-sidebar="sidebar"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
Sidebar.displayName = 'Sidebar'

export function SidebarTrigger({
  className,
  onClick,
  ref,
  ...props
}: ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  const onClickHandler = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    toggleSidebar()
  }, [onClick, toggleSidebar])

  return (
    <Button
      className={twMerge('size-7', className)}
      data-sidebar="trigger"
      onClick={onClickHandler}
      ref={ref}
      size="icon"
      variant="ghost"
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
SidebarTrigger.displayName = 'SidebarTrigger'

export function SidebarInset({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & ComponentProps<'main'>) {
  return (
    <main
      className={twMerge(
        'relative flex min-h-svh flex-1 flex-col bg-sidebar-background',
        'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
SidebarInset.displayName = 'SidebarInset'

export function SidebarInput({ className, ref, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      className={twMerge(
        'h-8 w-full bg-sidebar-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
        className
      )}
      data-sidebar="input"
      ref={ref}
      {...props}
    />
  )
}
SidebarInput.displayName = 'SidebarInput'

export function SidebarHeader({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge('flex flex-col gap-2 p-2', className)}
      data-sidebar="header"
      ref={ref}
      {...props}
    />
  )
}
SidebarHeader.displayName = 'SidebarHeader'

export function SidebarFooter({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge('flex flex-col gap-2 p-2', className)}
      data-sidebar="footer"
      ref={ref}
      {...props}
    />
  )
}
SidebarFooter.displayName = 'SidebarFooter'

export function SidebarSeparator({ className, ref, ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={twMerge('mx-2 w-auto bg-sidebar-border', className)}
      data-sidebar="separator"
      ref={ref}
      {...props}
    />
  )
}
SidebarSeparator.displayName = 'SidebarSeparator'

export function SidebarContent({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className
      )}
      data-sidebar="content"
      ref={ref}
      {...props}
    />
  )
}
SidebarContent.displayName = 'SidebarContent'

export function SidebarGroup({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge('relative flex w-full min-w-0 flex-col p-2', className)}
      data-sidebar="group"
      ref={ref}
      {...props}
    />
  )
}
SidebarGroup.displayName = 'SidebarGroup'

export function SidebarGroupLabel({
  className,
  ref,
  asChild = false,
  ...props
}: ComponentProps<'div'> & { readonly asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={twMerge(
        'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-text-muted outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className
      )}
      data-sidebar="group-label"
      ref={ref}
      {...props}
    />
  )
}
SidebarGroupLabel.displayName = 'SidebarGroupLabel'

export function SidebarGroupAction({
  className,
  ref,
  asChild = false,
  ...props
}: ComponentProps<'button'> & { readonly asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={twMerge(
        'absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-text outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-hover hover:text-sidebar-hover-text focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      data-sidebar="group-action"
      ref={ref}
      {...props}
    />
  )
}
SidebarGroupAction.displayName = 'SidebarGroupAction'

export function SidebarGroupContent({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge('w-full text-sm', className)}
      data-sidebar="group-content"
      ref={ref}
      {...props}
    />
  )
}
SidebarGroupContent.displayName = 'SidebarGroupContent'

export function SidebarMenu({ className, ref, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      className={twMerge('flex w-full min-w-0 flex-col gap-1', className)}
      data-sidebar="menu"
      ref={ref}
      {...props}
    />
  )
}
SidebarMenu.displayName = 'SidebarMenu'

export function SidebarMenuItem({ className, ref, ...props }: ComponentProps<'li'>) {
  return (
    <li
      className={twMerge('group/menu-item relative', className)}
      data-sidebar="menu-item"
      ref={ref}
      {...props}
    />
  )
}
SidebarMenuItem.displayName = 'SidebarMenuItem'

const sidebarMenuButtonVariants = tv(
  {
    base: 'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-hover hover:text-sidebar-hover-text focus-visible:ring-2 active:bg-sidebar-hover active:text-sidebar-hover-text disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-hover data-[active=true]:font-medium data-[active=true]:text-sidebar-hover-text data-[state=open]:hover:bg-sidebar-hover data-[state=open]:hover:text-sidebar-hover-text group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
    variants: {
      variant: {
        default: 'hover:bg-sidebar-hover hover:text-sidebar-hover-text',
        outline:
          'bg-sidebar-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-hover hover:text-sidebar-hover-text hover:shadow-[0_0_0_1px_hsl(var(--sidebar-hover))]'
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

interface SidebarMenuButtonProps extends ComponentProps<'button'>,
  VariantProps<typeof sidebarMenuButtonVariants> {
  readonly asChild?: boolean
  readonly isActive?: boolean
  readonly tooltip?: string | ComponentProps<typeof TooltipContent>
}

export function SidebarMenuButton({
  asChild = false,
  isActive = false,
  tooltip,
  className,
  ref,
  variant,
  size,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      className={twMerge(sidebarMenuButtonVariants({
        variant,
        size
      }), className)}
      data-active={isActive}
      data-sidebar="menu-button"
      data-size={size}
      ref={ref}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  const fixedTooltip = typeof tooltip === 'string' ? { children: tooltip } : tooltip

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>

      <TooltipContent
        align="center"
        hidden={state !== 'collapsed' || isMobile}
        side="right"
        {...fixedTooltip}
      />
    </Tooltip>
  )
}
SidebarMenuButton.displayName = 'SidebarMenuButton'

interface SidebarMenuAction extends ComponentProps<'button'>, VariantProps<typeof sidebarMenuButtonVariants> {
  readonly asChild?: boolean
  readonly showOnHover?: boolean
}
export function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ref,
  ...props
}: SidebarMenuAction) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={twMerge(
        'absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-text outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-hover hover:text-sidebar-hover-text focus-visible:ring-2 peer-hover/menu-button:text-sidebar-hover-text [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
        'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-hover-text md:opacity-0',
        className
      )}
      data-sidebar="menu-action"
      ref={ref}
      {...props}
    />
  )
}
SidebarMenuAction.displayName = 'SidebarMenuAction'

export function SidebarMenuBadge({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge(
        'pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-text',
        'peer-hover/menu-button:text-sidebar-hover-text peer-data-[active=true]/menu-button:text-sidebar-hover-text',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      data-sidebar="menu-badge"
      ref={ref}
      {...props}
    />
  )
}
SidebarMenuBadge.displayName = 'SidebarMenuBadge'

export function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ref,
  ...props
}: ComponentProps<'div'> & { readonly showIcon?: boolean }) {
  // Random width between 50 to 90%.
  const width = useMemo(() => {
    return `${(Math.floor(Math.random() * 40) + 50).toString()}%`
  }, [])

  return (
    <div
      className={twMerge('flex h-8 items-center gap-2 rounded-md px-2', className)}
      data-sidebar="menu-skeleton"
      ref={ref}
      {...props}
    >
      {showIcon ?
        (
          <Skeleton
            className="size-4 rounded-md"
            data-sidebar="menu-skeleton-icon"
          />
        ) :
        null}

      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={{
          // @ts-expect-error -- Since this is a CSS variable, it is still valid.
          '--skeleton-width': width
        }}
      />
    </div>
  )
}
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton'

export function SidebarMenuSub({ className, ref, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      className={twMerge(
        'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      data-sidebar="menu-sub"
      ref={ref}
      {...props}
    />
  )
}
SidebarMenuSub.displayName = 'SidebarMenuSub'

export function SidebarMenuSubItem(props: ComponentProps<'li'>) {
  return <li {...props} />
}
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'

interface SidebarMenuSubButton extends ComponentProps<'a'> {
  readonly asChild?: boolean
  readonly size?: 'sm' | 'md'
  readonly isActive?: boolean
}

export function SidebarMenuSubButton({
  asChild = false,
  size = 'md',
  isActive,
  className,
  ref,
  ...props
}: SidebarMenuSubButton) {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      className={twMerge(
        'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-text outline-none ring-sidebar-ring hover:bg-sidebar-hover hover:text-sidebar-hover-text focus-visible:ring-2 active:bg-sidebar-hover active:text-sidebar-hover-text disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-hover-text',
        'data-[active=true]:bg-sidebar-hover data-[active=true]:text-sidebar-hover-text',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      data-active={isActive}
      data-sidebar="menu-sub-button"
      data-size={size}
      ref={ref}
      {...props}
    />
  )
}
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'
