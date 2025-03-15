import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@kubestro/design-system'
import type { Column, Table } from '@tanstack/react-table'
import { SlidersHorizontal } from 'lucide-react'
import { useCallback } from 'react'

interface DataTableViewOptionsProps<TData> {
  readonly table: Table<TData>
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  const onVisibilityChange = useCallback((column: Column<TData>) => {
    return (value: boolean) => { column.toggleVisibility(Boolean(value)) }
  }, [])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className="ml-auto hidden h-8 lg:flex bg-secondary border border-secondary-hover border-dashed"
          size="sm"
          variant="secondary"
        >
          <SlidersHorizontal className="mr-2 size-4" />
          View
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {table
          .getAllColumns()
          .filter(
            column => typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                className="capitalize"
                key={column.id}
                onCheckedChange={onVisibilityChange(column)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
