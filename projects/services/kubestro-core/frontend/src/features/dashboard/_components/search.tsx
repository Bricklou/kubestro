import { Button } from '@kubestro/design-system'
import { SearchIcon } from 'lucide-react'
import { useCallback } from 'react'
import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { useSearch } from '~/hooks/search'

interface SearchProps {
  readonly placeholder?: string
}

export function Search({
  className,
  placeholder = 'Search...',
  ...props
}: ComponentProps<typeof Button> & SearchProps) {
  const { setOpen } = useSearch()

  const onSearchClick = useCallback(() => { setOpen(true) }, [setOpen])

  return (
    <Button
      className={twMerge(
        'cursor-pointer relative h-8 w-full inline-flex items-center justify-start rounded-md border border-border bg-background-contrast text-sm font-normal text-text-muted shadow-none hover:bg-background-contrast/90 hover:border-primary sm:pr-12 md:max-w-lg md:flex-none',
        'active:scale-100',
        className
      )}
      onClick={onSearchClick}
      variant="ghost"
      {...props}
    >
      <SearchIcon aria-hidden className="absolute !size-4 left-2" />
      <span className="ml-4">{placeholder}</span>

      <kbd className="pointer-events-none absolute right-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border border-border bg-secondary px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">^</span>K
      </kbd>
    </Button>
  )
}
