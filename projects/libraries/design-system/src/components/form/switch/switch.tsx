import type { ComponentProps } from 'react'
import { Root, Thumb } from '@radix-ui/react-switch'
import { twMerge } from 'tailwind-merge'

export function Switch({ className, ref, ...props }: ComponentProps<typeof Root>) {
  return (
    <Root
      className={twMerge(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-1 border-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-secondary',
        className
      )}
      {...props}
      ref={ref}
    >
      <Thumb
        className={twMerge(
          'pointer-events-none block h-4 w-4 rounded-full bg-background ring-0 transition-transform data-[state=checked]:translate-x-4.25 data-[state=unchecked]:translate-x-0.5 data-[state=unchecked]:bg-secondary',
          'dark:data-[state=unchecked]:bg-background'
        )}
      />
    </Root>
  )
}
Switch.displayName = Root.displayName
