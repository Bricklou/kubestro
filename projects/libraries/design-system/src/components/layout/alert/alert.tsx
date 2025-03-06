import type { HTMLAttributes, RefAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

const alertVariants = tv(
  {
    base: 'relative w-full rounded-lg px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-secondary-text [&>svg~*]:pl-7',
    variants: {
      variant: {
        default: 'bg-secondary text-text',
        warning: 'bg-warning text-warning-text [&>svg]:text-warning-text',
        danger: 'bg-danger text-danger-text [&>svg]:text-danger-text'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

interface AlertProps extends
  HTMLAttributes<HTMLDivElement>,
  RefAttributes<HTMLDivElement>,
  VariantProps<typeof alertVariants> { }

export function Alert({ className, variant, ref, ...props }: AlertProps) {
  return (
    <div
      className={alertVariants({
        variant,
        className
      })}
      ref={ref}
      role="alert"
      {...props}
    />
  )
}
Alert.displayName = 'Alert'

interface AlertTitleProps extends
  HTMLAttributes<HTMLHeadingElement>,
  RefAttributes<HTMLHeadingElement> { }

export function AlertTitle({ className, children, ref, ...props }: AlertTitleProps) {
  return (
    <h5
      className={twMerge('mb-1 font-semibold leading-none tracking-tight', className)}
      ref={ref}
      {...props}
    >
      {children}
    </h5>
  )
}
AlertTitle.displayName = 'AlertTitle'

interface AlertDescriptionProps extends
  HTMLAttributes<HTMLParagraphElement>,
  RefAttributes<HTMLParagraphElement> { }

export function AlertDescription({ className, children, ref, ...props }: AlertDescriptionProps) {
  return (
    <p
      className={twMerge('text-sm leading-relaxed', className)}
      ref={ref}
      {...props}
    >
      {children}
    </p>
  )
}
AlertDescription.displayName = 'AlertDescription'
