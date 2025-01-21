import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import React, { ReactElement, Ref } from 'react'
import { tv, VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'inline-flex transform items-center justify-center gap-x-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      primary: 'bg-primary text-primary-text hover:bg-primary/90 active:bg-primary/80',
      secondary: 'border border-secondary-text/5 bg-secondary text-secondary-text hover:bg-secondary/80 active:bg-secondary/70',
      destructive: 'bg-destructive text-destructive',
      ghost: 'hover:bg-secondary hover:text-secondary-text active:bg-secondary/90',
      link: '',

    },
    size: {
      sm: 'rounded-md px-3 py-1',
      md: 'px-4 py-2',
      lg: 'rounded-md px-8 py-3',
      icon: 'size-10',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  /**
   * Component Ref
   */
  ref?: Ref<HTMLButtonElement>

  /**
     * If enabled, the props will be passed to the child component
     */
  asChild?: boolean
  /**
   * If enabled, the button will be in loading state
   */
  loading?: boolean
  /**
   * Icon component
   */
  icon?: ReactElement
}

export function Button({ children, loading, icon, disabled, asChild, type, variant, className, ref, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp ref={ref} type={type ?? 'button'} disabled={loading ?? disabled} className={buttonVariants({ variant, className })} {...props}>
      {loading ? <Loader2 className="size-5 animate-spin" aria-hidden /> : icon}
      {children}
    </Comp>
  )
}
