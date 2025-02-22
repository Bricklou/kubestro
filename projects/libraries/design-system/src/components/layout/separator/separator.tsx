import type { ComponentProps } from 'react'
import { Root } from '@radix-ui/react-separator'
import { twMerge } from 'tailwind-merge'

export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ref,
  ...props
}: ComponentProps<typeof Root>) {
  return (
    <Root
      className={twMerge(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      decorative={decorative}
      orientation={orientation}
      ref={ref}
      {...props}
    />
  )
}
Separator.displayName = Root.displayName
