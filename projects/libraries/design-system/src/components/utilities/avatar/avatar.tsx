import type { ComponentProps } from 'react'
import { Root, Image, Fallback } from '@radix-ui/react-avatar'
import { twMerge } from 'tailwind-merge'

export function Avatar({ className, ref, ...props }: ComponentProps<typeof Root>) {
  return (
    <Root
      className={twMerge(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
Avatar.displayName = Root.displayName

export function AvatarImage({ className, ref, ...props }: ComponentProps<typeof Image>) {
  return (
    <Image
      className={twMerge('aspect-square h-full w-full', className)}
      ref={ref}
      {...props}
    />
  )
}
AvatarImage.displayName = Image.displayName

export function AvatarFallback({ className, ref, ...props }: ComponentProps<typeof Fallback>) {
  return (
    <Fallback
      className={twMerge(
        'flex h-full w-full items-center justify-center rounded-full bg-primary-soft',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
AvatarFallback.displayName = Fallback.displayName
