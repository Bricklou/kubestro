import type { HTMLAttributes } from 'react'
import { skeletonVariant } from './style'

type SkeletonProps = HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={skeletonVariant({ className })} {...props} />
}
