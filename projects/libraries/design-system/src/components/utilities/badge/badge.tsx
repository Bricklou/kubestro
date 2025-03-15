import type { HTMLAttributes } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

export const badgeVariants = tv({
  base: 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  variants: {
    variant: {
      'primary':
        'border-transparent bg-primary text-primary-text shadow hover:bg-primary/80',
      'primary-soft':
        'border-transparent bg-primary-soft text-primary-soft-text shadow hover:bg-primary-soft/80',
      'secondary':
        'border-transparent bg-secondary text-secondary-text hover:bg-secondary/80',
      'warning':
        'border-transparent bg-warning text-warning-text shadow hover:bg-warning/80',
      'danger':
        'border-transparent bg-danger text-danger-text shadow hover:bg-danger/80',
      'outline': 'text-text border border-border bg-secondary/20'
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
})

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={badgeVariants({
        variant,
        className
      })}
      {...props}
    />
  )
}
