import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import type {
  ButtonHTMLAttributes, ReactElement, RefAttributes
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { buttonVariants } from './style'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,
  RefAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {

  /**
   * If enabled, the props will be passed to the child component
   */
  readonly asChild?: boolean

  /**
   * If enabled, the button will be in loading state
   */
  readonly loading?: boolean

  /**
   * Icon component
   */
  readonly icon?: ReactElement
}

export function Button({
  children,
  loading,
  icon,
  disabled,
  asChild,
  type,
  variant,
  className,
  ref,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={buttonVariants({
        variant,
        className
      })}
      disabled={loading ?? disabled}
      ref={ref}
      type={type ?? 'button'}
      {...props}
    >
      {loading ? <Loader2 aria-hidden className="size-5 animate-spin" /> : icon}
      {children}
    </Comp>
  )
}
