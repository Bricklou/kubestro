import { Root } from '@radix-ui/react-label'
import type { VariantProps } from 'tailwind-variants'
import type { ComponentProps } from 'react'
import { labelVariants } from './style'

interface LabelProps extends ComponentProps<typeof Root>,
  VariantProps<typeof labelVariants> { }

export function Label({ className, ...props }: LabelProps) {
  return (
    <Root
      className={labelVariants({ className })}
      {...props}
    />
  )
}
