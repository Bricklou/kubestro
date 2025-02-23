import type { HTMLAttributes } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

export const badgeVariants = tv({
  base: 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  variants: {
    variant: {
      default:
        'border-transparent bg-primary text-primary-text shadow hover:bg-primary/80',
      secondary:
        'border-transparent bg-secondary text-secondary-text hover:bg-secondary/80',
      warning:
        'border-transparent bg-warning text-warning-text shadow hover:bg-warning/80',
      danger:
        'border-transparent bg-destructive text-danger-text shadow hover:bg-destructive/80',
      outline: 'text-text'
    }
  },
  defaultVariants: {
    variant: 'default'
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
