import { Provider, Root, Trigger, Content, Portal } from '@radix-ui/react-tooltip'
import type { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

export const TooltipProvider = Provider

export const Tooltip = Root

export const TooltipTrigger = Trigger

export function TooltipContent({
  className,
  sideOffset = 4,
  ref,
  ...props
}: ComponentPropsWithRef<typeof Content>) {
  return (
    <Portal>
      <Content
        className={twMerge(

          'z-50 overflow-hidden rounded-md bg-background-contrast border border-border px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      />
    </Portal>
  )
}
TooltipContent.displayName = Content
