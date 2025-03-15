import { Badge, Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, Popover, PopoverContent, PopoverTrigger, Separator } from '@kubestro/design-system/components'
import { CheckIcon, PlusCircleIcon } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import type { ComponentType } from 'react'
import { twMerge } from 'tailwind-merge'
import type { Column } from '@tanstack/react-table'

interface TableFacetedFilterProps<TData, TValue> {
  readonly column?: Column<TData, TValue>
  readonly title?: string
  readonly options: {
    label: string
    value: string
    icon?: ComponentType<{ className?: string }>
  }[]
}

export function TableFacetedFilter<TData, TValue>({
  column,
  title,
  options
}: TableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const filterValue = column?.getFilterValue() as string[] | undefined
  const selectedValues = useMemo(() => new Set(filterValue ?? []), [filterValue])

  const isCommandItemSelected = useCallback((option: TableFacetedFilterProps<TData, TValue>['options'][number], isSelected: boolean) => {
    return () => {
      if (isSelected) {
        selectedValues.delete(option.value)
      }
      else {
        selectedValues.add(option.value)
      }

      const filterValues = Array.from(selectedValues)
      column?.setFilterValue(
        filterValues.length ? filterValues : undefined
      )
    }
  }, [column, selectedValues])

  const clearFilter = useCallback(() => {
    column?.setFilterValue(undefined)
  }, [column])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="h-8 bg-secondary/60 border border-secondary-hover border-dashed"
          icon={PlusCircleIcon}
          size="sm"
          variant="secondary"
        >
          {title}

          {selectedValues.size > 0 ?
            (
              <>
                <Separator className="mx-2 h-4" orientation="vertical" />

                <Badge className="rounded-sm px-1 font-normal lg:hidden" variant="secondary">
                  {selectedValues.size}
                </Badge>

                <div className="hidden space-x-1 lg:flex">
                  {selectedValues.size > 2 ?
                    (
                      <Badge className="rounded-sm px-1 font-normal" variant="secondary">
                        {selectedValues.size} selected
                      </Badge>
                    ) :
                    (
                      options.filter(option => selectedValues.has(option.value))
                        .map(option => (
                          <Badge
                            className="rounded-sm px-1 font-normal"
                            key={option.value}
                            variant="secondary"
                          >
                            {option.label}
                          </Badge>
                        ))
                    )}
                </div>
              </>
            ) :
            null}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={title} />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={isCommandItemSelected(option, isSelected)}
                  >
                    <div
                      className={twMerge(
                        'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected ? 'bg-primary text-primary-text' : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className="size-4" />
                    </div>

                    {option.icon ? <option.icon className="mr-2 size-4 text-text-muted" /> : null}
                    <span>{option.label}</span>

                    {facets?.get(option.value) ?
                      (
                        <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                          {facets.get(option.value)}
                        </span>
                      ) :
                      null}
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {selectedValues.size > 0 ?
              (
                <>
                  <CommandSeparator />

                  <CommandGroup>
                    <CommandItem className="justify-center text-center" onSelect={clearFilter}>
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              ) :
              null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
