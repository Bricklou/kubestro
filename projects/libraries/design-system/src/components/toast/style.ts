import { twJoin } from 'tailwind-merge'
import { tv } from 'tailwind-variants'
import { buttonVariants } from '../button'

export const toastVariants = tv({
  slots: {
    toast: twJoin(
      'group pointer-events-auto relative flex w-full items-center justify-center space-x-4 overflow-hidden rounded-lg border border-border',
      'bg-background-contrast px-4 py-2 shadow-md transition-all',
      'data[swipe=end]translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full',
      'data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full'
    ),
    icon: 'size-4',
    title: 'text-sm font-semibold',
    description: 'text-sm opacity-80',
    viewport: 'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
    actionButton: buttonVariants({
      variant: 'ghost',
      className: '[:first-child]:size-5 inline-flex size-6 items-center justify-center text-secondary-text',
      size: 'icon'
    }),
    closeButton: buttonVariants({
      variant: 'ghost',
      className: '[:first-child]:size-7 inline-flex size-8 items-center justify-center text-secondary-text',
      size: 'icon'
    })
  },
  variants: {
    variant: {
      info: {
        icon: 'text-info-text',
        title: 'text-info-text',
        toast: 'bg-info border-info',
        closeButton: 'hover:bg-info-hover'
      },
      success: {
        icon: 'text-success-text',
        title: 'text-success-text',
        toast: 'bg-success border-success',
        closeButton: 'hover:bg-success-hover'
      },
      warning: {
        icon: 'text-warning-text',
        title: 'text-warning-text',
        toast: 'bg-warning border-warning',
        closeButton: 'hover:bg-warning-hover'
      },
      error: {
        icon: 'text-danger-text',
        title: 'text-danger-text',
        toast: 'bg-danger border-danger',
        closeButton: 'hover:bg-danger-hover'
      }
    }
  },
  defaultVariants: {
    variant: 'info'
  }
})
