import type { ComponentProps, HTMLAttributes } from 'react'
import { Root, Trigger, Group, Portal, Sub, RadioGroup, SubTrigger, SubContent, Content, Item, CheckboxItem, ItemIndicator, RadioItem, Label, Separator } from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export const DropdownMenu = Root

export const DropdownMenuTrigger = Trigger

export const DropdownMenuGroup = Group

export const DropdownMenuPortal = Portal

export const DropdownMenuSub = Sub

export const DropdownMenuRadioGroup = RadioGroup

export function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ref,
  ...props
}: ComponentProps<typeof SubTrigger> & { readonly inset?: boolean }) {
  return (
    <SubTrigger
      className={twMerge(
        'flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-primary-soft data-[state=open]:bg-primary-soft [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        inset && 'pl-8',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </SubTrigger>
  )
}
DropdownMenuSubTrigger.displayName =
  SubTrigger.displayName

export function DropdownMenuSubContent({
  className,
  ref,
  ...props
}: ComponentProps<typeof SubContent>) {
  return (
    <SubContent
      className={twMerge(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-text shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
DropdownMenuSubContent.displayName =
  SubContent.displayName

export function DropdownMenuContent({
  className,
  sideOffset = 4,
  ref,
  ...props
}: ComponentProps<typeof Content> & { readonly sideOffset?: number }) {
  return (
    <Portal>
      <Content
        className={twMerge(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-text shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      />
    </Portal>
  )
}
DropdownMenuContent.displayName = Content.displayName

export function DropdownMenuItem({
  className,
  inset,
  ref,
  ...props
}: ComponentProps<typeof Item> & { readonly inset?: boolean }) {
  return (
    <Item
      className={twMerge(
        'relative flex cursor-default hover:bg-secondary-hover select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-primary-soft focus:text-primary-soft-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
        inset && 'pl-8',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
DropdownMenuItem.displayName = Item.displayName

export function DropdownMenuCheckboxItem({
  className,
  checked,
  children,
  ref,
  ...props
}: ComponentProps<typeof CheckboxItem>) {
  return (
    <CheckboxItem
      checked={checked}
      className={twMerge(
        'relative flex cursor-default hover:bg-secondary-hover select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-primary-soft focus:text-accent-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ItemIndicator>
          <Check className="h-4 w-4" />
        </ItemIndicator>
      </span>

      {children}
    </CheckboxItem>
  )
}
DropdownMenuCheckboxItem.displayName =
  CheckboxItem.displayName

export function DropdownMenuRadioItem({
  className,
  children,
  ref,
  ...props
}: ComponentProps<typeof RadioItem>) {
  return (
    <RadioItem
      className={twMerge(
        'relative flex cursor-default hover:bg-secondary-hover select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-primary-soft focus:text-accent-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </ItemIndicator>
      </span>

      {children}
    </RadioItem>
  )
}
DropdownMenuRadioItem.displayName = RadioItem.displayName

export function DropdownMenuLabel({
  className,
  inset,
  ref,
  ...props
}: ComponentProps<typeof Label> & { readonly inset?: boolean }) {
  return (
    <Label
      className={twMerge(
        'px-2 py-1.5 text-sm font-semibold',
        inset && 'pl-8',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
DropdownMenuLabel.displayName = Label.displayName

export function DropdownMenuSeparator({
  ref,
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={twMerge('-mx-1 my-1 h-px bg-border', className)}
      ref={ref}
      {...props}
    />
  )
}
DropdownMenuSeparator.displayName = Separator.displayName

export function DropdownMenuShortcut({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={twMerge('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'
