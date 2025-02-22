import type { ComponentProps } from 'react'
import { Root, Trigger, Portal, Close, Overlay, Content, Title, Description } from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export const Dialog = Root

export const DialogTrigger = Trigger

export const DialogPortal = Portal

export const DialogClose = Close

export function DialogOverlay({ className, ref, ...props }: ComponentProps<typeof Overlay>) {
  return (
    <Overlay
      className={twMerge(
        'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
DialogOverlay.displayName = Overlay.displayName

export function DialogContent({
  className,
  children,
  ref,
  ...props
}: ComponentProps<typeof Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <Content
        className={twMerge(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}

        <Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Close>
      </Content>
    </DialogPortal>
  )
}
DialogContent.displayName = Content.displayName

export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge(
        'flex flex-col space-y-1.5 text-center sm:text-left',
        className
      )}
      {...props}
    />
  )
}
DialogHeader.displayName = 'DialogHeader'

export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className
      )}
      {...props}
    />
  )
}
DialogFooter.displayName = 'DialogFooter'

export function DialogTitle({ className, ref, ...props }: ComponentProps<typeof Title>) {
  return (
    <Title
      className={twMerge(
        'text-lg font-semibold leading-none tracking-tight',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
DialogTitle.displayName = Title.displayName

export function DialogDescription({
  className,
  ref,
  ...props
}: ComponentProps<typeof Description>) {
  return (
    <Description
      className={twMerge('text-sm text-muted-foreground', className)}
      ref={ref}
      {...props}
    />
  )
}
DialogDescription.displayName = Description.displayName
