import type { ComponentProps } from 'react'
import { Root, Indicator } from '@radix-ui/react-progress'

import { twMerge } from 'tailwind-merge'

interface ProgressProps extends ComponentProps<typeof Root> {
  readonly indicatorClassName?: string
  readonly value: number
}

export function Progress({
  className,
  indicatorClassName,
  'aria-valuemin': ariaValueMin = 0,
  'aria-valuemax': ariaValueMax = 100,
  value = 0,
  ref,
  ...props
}: ProgressProps) {
  // Compute the percentage of the progress based on min/max/now values
  const percentage = (value - ariaValueMin) / (ariaValueMax - ariaValueMin) * 100
  const translate = 100 - percentage

  return (
    <Root
      className={twMerge(
        'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
        className
      )}
      ref={ref}
      value={value}
      {...props}
    >
      <Indicator
        className={twMerge('h-full w-full flex-1 bg-primary transition-all', indicatorClassName)}
        style={{ transform: `translateX(-${translate.toString()}%)` }}
      />
    </Root>
  )
}
Progress.displayName = Root.displayName
