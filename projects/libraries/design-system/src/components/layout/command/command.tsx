import type { ComponentProps, HTMLAttributes } from 'react'
import type { DialogProps } from '@radix-ui/react-dialog'
import { Command as CommandPrimitive } from 'cmdk'
import { Search } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { Dialog, DialogContent } from '../dialog'

export function Command({ className, ref, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={twMerge(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-text',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
Command.displayName = CommandPrimitive.displayName

export function CommandDialog({ children, ...props }: DialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-text-muted [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-4 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-4">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export function CommandInput({
  className,
  ref,
  ...props
}: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    // eslint-disable-next-line react/no-unknown-property
    <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />

      <CommandPrimitive.Input
        className={twMerge(
          'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
}
CommandInput.displayName = CommandPrimitive.Input.displayName

export function CommandList({
  className,
  ref,
  ...props
}: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={twMerge('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
      ref={ref}
      {...props}
    />
  )
}
CommandList.displayName = CommandPrimitive.List.displayName

export function CommandEmpty({
  className,
  ref,
  ...props
}: ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className={twMerge('py-6 text-center text-sm', className)}
      ref={ref}
      {...props}
    />
  )
}
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

export function CommandGroup({
  className,
  ref,
  ...props
}: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={twMerge(
        'overflow-hidden p-1 text-text [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-text-muted',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
CommandGroup.displayName = CommandPrimitive.Group.displayName

export function CommandSeparator({
  className,
  ref,
  ...props
}: ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={twMerge('-mx-1 h-px bg-border', className)}
      ref={ref}
      {...props}
    />
  )
}
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

export function CommandItem({
  className,
  ref,
  ...props
}: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={twMerge(
        'relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-secondary data-[selected=true]:text-secondary-text data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
CommandItem.displayName = CommandPrimitive.Item.displayName

export function CommandShortcut({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={twMerge(
        'ml-auto text-xs tracking-widest text-text-muted',
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = 'CommandShortcut'
