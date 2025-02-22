import type { ComponentProps } from 'react'
import { Root, Viewport, Corner, ScrollAreaScrollbar, ScrollAreaThumb } from '@radix-ui/react-scroll-area'
import { twMerge } from 'tailwind-merge'

export function ScrollBar({
  className,
  orientation = 'vertical',
  ref,
  ...props
}: ComponentProps<typeof ScrollAreaScrollbar>) {
  return (
    <ScrollAreaScrollbar
      className={twMerge(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
        orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',
        className
      )}
      orientation={orientation}
      ref={ref}
      {...props}
    >
      <ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaScrollbar>
  )
}

ScrollBar.displayName = ScrollAreaScrollbar.displayName
export function ScrollArea({ className, children, ref, ...props }: ComponentProps<typeof Root>) {
  return (
    <Root
      className={twMerge('relative overflow-hidden', className)}
      ref={ref}
      {...props}
    >
      <Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </Viewport>

      <ScrollBar />
      <Corner />
    </Root>
  )
}
ScrollArea.displayName = Root.displayName
