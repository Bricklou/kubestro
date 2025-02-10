import {
  Action,
  Close,
  Provider, Root, Title, Viewport
} from '@radix-ui/react-toast'
import type {
  ComponentProps, ComponentPropsWithRef, ReactElement
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import {
  CircleCheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon,
  XIcon
} from 'lucide-react'
import { twJoin } from 'tailwind-merge'
import { toastVariants } from './style'

export const ToastProvider = Provider

export function ToastViewport({ className, ref, ...props }: ComponentProps<typeof Viewport>) {
  const { viewport } = toastVariants()

  return <Viewport className={viewport({ className })} ref={ref} {...props} />
}
ToastViewport.displayName = Viewport.displayName

export function Toast({
  className,
  variant,
  ref,
  ...props
}: ComponentProps<typeof Root> & Pick<VariantProps<typeof toastVariants>, 'variant'>) {
  const { toast } = toastVariants({
    variant,
    className
  })

  return <Root className={toast({ className })} ref={ref} {...props} />
}
Toast.displayName = Root.displayName

export function ToastAction({ className, ref, ...props }: ComponentProps<typeof Action>) {
  const { actionButton } = toastVariants()
  return <Action className={actionButton({ className })} ref={ref} {...props} />
}
ToastAction.displayName = Action.displayName

export function ToastClose({
  className,
  ref,
  variant,
  ...props
}: ComponentProps<typeof Close> & Pick<VariantProps<typeof toastVariants>, 'variant'>) {
  const { closeButton } = toastVariants({ variant })
  return (
    <div className="relative size-8 flex flex-col items-center justify-center align-middle">
      <Close
        className={closeButton({ className: twJoin('relative z-1', className) })}
        ref={ref}
        toast-close=""
        {...props}
      >
        <XIcon className="text-current" />
      </Close>
    </div>
  )
}
ToastClose.displayName = Close.displayName

export function ToastTitle({
  className,
  ref,
  variant,
  ...props
}: ComponentProps<typeof Title> & Pick<VariantProps<typeof toastVariants>, 'variant'>) {
  const { title } = toastVariants({ variant })
  return <Title className={title({ className })} ref={ref} {...props} />
}
ToastTitle.displayName = Title.displayName

export function ToastDescription({ className, ref, ...props }: ComponentProps<'p'>) {
  const { description } = toastVariants()
  return <p className={description({ className })} ref={ref} {...props} />
}

export function ToastIcon({
  variant = 'info'
}: Pick<VariantProps<typeof toastVariants>, 'variant'>) {
  const { icon } = toastVariants({ variant })

  switch (variant) {
    case 'error':
      return <CircleXIcon className={icon()} />
    case 'success':
      return <CircleCheckIcon className={icon()} />
    case 'warning':
      return <TriangleAlertIcon className={icon()} />
    case 'info':
    default:
      return <InfoIcon className={icon()} />
  }
}

export type ToastProps = ComponentPropsWithRef<typeof Toast>
export type ToastActionElement = ReactElement<typeof ToastAction>
