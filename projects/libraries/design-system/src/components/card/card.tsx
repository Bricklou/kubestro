import type { HTMLAttributes, RefAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export function Card({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        'rounded-xl border bg-card text-card-foreground shadow',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
Card.displayName = 'Card'

export function CardHeader({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge('flex flex-col space-y-1.5 p-6', className)}
      ref={ref}
      {...props}
    />
  )
}
CardHeader.displayName = 'CardHeader'

export function CardTitle({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge('font-semibold leading-none tracking-tight', className)}
      ref={ref}
      {...props}
    />
  )
}
CardTitle.displayName = 'CardTitle'

export function CardDescription({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge('text-sm text-text-muted', className)}
      ref={ref}
      {...props}
    />
  )
}
CardDescription.displayName = 'CardDescription'

export function CardContent({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>) {
  return <div className={twMerge('p-6 pt-0', className)} ref={ref} {...props} />
}
CardContent.displayName = 'CardContent'

export function CardFooter({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge('flex items-center p-6 pt-0', className)}
      ref={ref}
      {...props}
    />
  )
}
CardFooter.displayName = 'CardFooter'
