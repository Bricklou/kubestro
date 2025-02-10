import { Slot, Slottable } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import {
  useCallback

} from 'react'
import type {
  ButtonHTMLAttributes, ElementType, RefAttributes
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
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
}

interface IconProps {

  /**
   * Icon component
   */
  readonly icon: ElementType

  /**
   * Icon placement
   */
  readonly iconPlacement?: 'left' | 'right'
}

interface IconRefProps {
  readonly icon?: never
  readonly iconPlacement?: undefined
}

export type ButtonIconProps = IconProps | IconRefProps

export function Button({
  children,
  loading,
  icon: Icon,
  iconPlacement,
  disabled,
  asChild = false,
  type,
  variant,
  effect,
  size,
  className,
  ref,
  ...props
}: ButtonProps & ButtonIconProps) {
  const Comp = asChild ? Slot : 'button'

  /**
   * Decide whether to render the icon or the loader
   */
  const IconToRender = useCallback(() => {
    if (loading) return <Loader2 aria-hidden className="animate-spin" />

    if (!Icon) return null

    return <Icon aria-hidden />
  }, [Icon, loading])

  /**
   * Render the icon depending on the placement and the effect
   */
  const RenderIcon = useCallback(({ placement }: { readonly placement: 'left' | 'right' }) => {
    if (!Icon || !iconPlacement || placement !== iconPlacement) return null

    if (effect === 'expandIcon') {
      return (
        <div
          className={twMerge(
            'w-0 opacity-0 transition-all duration-200 group-hover:w-6 group-hover:opacity-100',
            placement === 'left' && 'translate-x-[0%] pr-0 group-hover:pr-2',
            placement === 'right' && 'translate-x-[100%] pl-0 group-hover:pl-2 group-hover:translate-x-0',
            // When loading
            loading && [
              'w-6 opacity-100',
              // When loading with placement left
              placement === 'left' && 'pr-2',
              // When loading with placement right
              placement === 'right' && 'pl-2 translate-x-0'
            ]
          )}
        >
          <IconToRender />
        </div>
      )
    }

    return <IconToRender />
  }, [
    Icon,
    iconPlacement,
    effect,
    loading,
    IconToRender
  ])

  return (
    <Comp
      className={buttonVariants({
        variant,
        className,
        size,
        effect
      })}
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      disabled={loading || disabled}
      ref={ref}
      type={type ?? 'button'}
      {...props}
    >
      <RenderIcon placement="left" />
      <Slottable>{children}</Slottable>
      <RenderIcon placement="right" />
    </Comp>
  )
}
