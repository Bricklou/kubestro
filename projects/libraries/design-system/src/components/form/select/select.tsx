import type { ComponentProps } from 'react'
import { Root, Group, Value, Trigger, Icon, ScrollUpButton, ScrollDownButton, Content, Portal, Viewport, Label, Item, ItemIndicator, ItemText, Separator } from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export const Select = Root

export const SelectGroup = Group

export const SelectValue = Value

export function SelectTrigger({
  className,
  children,
  ref,
  ...props
}: ComponentProps<typeof Trigger>) {
  return (
    <Trigger
      className={twMerge(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-text-muted focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}

      <Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Icon>
    </Trigger>
  )
}
SelectTrigger.displayName = Trigger.displayName

export function SelectScrollUpButton({
  className,
  ref,
  ...props
}: ComponentProps<typeof ScrollUpButton>) {
  return (
    <ScrollUpButton
      className={twMerge(
        'flex cursor-default items-center justify-center py-1',
        className
      )}
      ref={ref}
      {...props}
    >
      <ChevronUp className="h-4 w-4" />
    </ScrollUpButton>
  )
}
SelectScrollUpButton.displayName = ScrollUpButton.displayName

export function SelectScrollDownButton({
  className,
  ref,
  ...props
}: ComponentProps<typeof ScrollDownButton>) {
  return (
    <ScrollDownButton
      className={twMerge(
        'flex cursor-default items-center justify-center py-1',
        className
      )}
      ref={ref}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </ScrollDownButton>
  )
}
SelectScrollDownButton.displayName =
  ScrollDownButton.displayName

export function SelectContent({
  className,
  children,
  position = 'popper',
  ref,
  ...props
}: ComponentProps<typeof Content>) {
  return (
    <Portal>
      <Content
        className={twMerge(
          'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-text shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        ref={ref}
        {...props}
      >
        <SelectScrollUpButton />

        <Viewport
          className={twMerge(
            'p-1',
            position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
          )}
        >
          {children}
        </Viewport>

        <SelectScrollDownButton />
      </Content>
    </Portal>
  )
}
SelectContent.displayName = Content.displayName

export function SelectLabel({ className, ref, ...props }: ComponentProps<typeof Label>) {
  return (
    <Label
      className={twMerge('px-2 py-1.5 text-sm font-semibold', className)}
      ref={ref}
      {...props}
    />
  )
}
SelectLabel.displayName = Label.displayName

export function SelectItem({ className, children, ref, ...props }: ComponentProps<typeof Item>) {
  return (
    <Item
      className={twMerge(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-primary-soft focus:text-secondary-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <ItemIndicator>
          <Check className="h-4 w-4" />
        </ItemIndicator>
      </span>

      <ItemText>{children}</ItemText>
    </Item>
  )
}
SelectItem.displayName = Item.displayName

export function SelectSeparator({ className, ref, ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={twMerge('-mx-1 my-1 h-px bg-muted', className)}
      ref={ref}
      {...props}
    />
  )
}
SelectSeparator.displayName = Separator.displayName
