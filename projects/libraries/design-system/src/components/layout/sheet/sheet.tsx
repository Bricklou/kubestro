import type { ComponentProps, HTMLAttributes } from 'react'
import { Root, Trigger, Close, Portal, Overlay, Content, Title, Description } from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

export const Sheet = Root

export const SheetTrigger = Trigger

export const SheetClose = Close

export const SheetPortal = Portal

export function SheetOverlay({ className, ref, ...props }: ComponentProps<typeof Overlay>) {
  return (
    <Overlay
      className={twMerge(
        'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
      ref={ref}
    />
  )
}
SheetOverlay.displayName = Overlay.displayName

const sheetVariants = tv({
  base: 'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out border-border',
  variants: {
    side: {
      top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
      bottom:
        'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
      left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
      right:
        'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm'
    }
  },
  defaultVariants: {
    side: 'right'
  }
})

interface SheetContentProps
  extends ComponentProps<typeof Content>,
  VariantProps<typeof sheetVariants> { }

export function SheetContent({
  side = 'right',
  className,
  children,
  ref,
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />

      <Content
        className={twMerge(sheetVariants({ side }), className)}
        ref={ref}
        {...props}
      >
        <Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Close>

        {children}
      </Content>
    </SheetPortal>
  )
}
SheetContent.displayName = Content.displayName

export function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        'flex flex-col space-y-2 text-center sm:text-left',
        className
      )}
      {...props}
    />
  )
}
SheetHeader.displayName = 'SheetHeader'

export function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
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
SheetFooter.displayName = 'SheetFooter'

interface SheetTitleProps extends HTMLAttributes<HTMLHeadingElement>,
  ComponentProps<typeof Title> { }

export function SheetTitle({ className, ref, ...props }: SheetTitleProps) {
  return (
    <Title
      className={twMerge('text-lg font-semibold text-foreground', className)}
      ref={ref}
      {...props}
    />
  )
}
SheetTitle.displayName = Title.displayName

export function SheetDescription({ className, ref, ...props }: ComponentProps<typeof Description>) {
  return (
    <Description
      className={twMerge('text-sm text-muted-foreground', className)}
      ref={ref}
      {...props}
    />
  )
}
SheetDescription.displayName = Description.displayName
