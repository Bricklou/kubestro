import { Root, Indicator } from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type CheckboxProps = ComponentProps<typeof Root>

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <Root
      className={twMerge(
        'peer size-4.5 shrink-0 rounded-md border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-text',
        className
      )}
      {...props}
    >
      <Indicator className="flex items-center justify-center text-current">
        <Check className="size-3.5" />
      </Indicator>
    </Root>
  )
}
