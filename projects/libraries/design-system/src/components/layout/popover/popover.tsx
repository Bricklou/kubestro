import type { ComponentProps } from 'react'
import { Root, Trigger, Anchor, Content, Portal, Close } from '@radix-ui/react-popover'
import { twMerge } from 'tailwind-merge'

export const Popover = Root

export const PopoverTrigger = Trigger

export const PopoverAnchor = Anchor

export const PopoverClose = Close

export function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ref,
  ...props
}: ComponentProps<typeof Content>) {
  return (
    <Portal>
      <Content
        align={align}
        className={twMerge(
          'z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-text shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      />
    </Portal>
  )
}
PopoverContent.displayName = Content.displayName
