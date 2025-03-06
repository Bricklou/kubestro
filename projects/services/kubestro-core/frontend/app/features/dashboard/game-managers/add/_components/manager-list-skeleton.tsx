import { Skeleton } from '@kubestro/design-system/components'

export function ManagersListSkeleton() {
  return (
    <section className="flex flex-col gap-4" >
      <Skeleton className="h-6 w-48" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 pb-16">
        {Array.from({ length: 6 }).map((__, cardIndex) => (
          <Skeleton className="w-full h-32" key={cardIndex} />
        ))}
      </div>
    </section>
  )
}
