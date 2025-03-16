import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@kubestro/design-system/components'
import type { Column } from '@tanstack/react-table'
import { ArrowDownAZIcon, ArrowDownUpIcon, ArrowUpAZIcon, EyeOffIcon } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  readonly column: Column<TData, TValue>
  readonly title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  const onSort = useCallback((sortState: boolean) => {
    return () => {
      column.toggleSorting(sortState)
    }
  }, [column])

  const onHide = useCallback(() => {
    column.toggleVisibility(false)
  }, [column])

  const columnIsSorted = column.getIsSorted()
  const buttonIcon = useMemo(() => {
    if (columnIsSorted === 'asc') {
      return ArrowDownAZIcon
    }
    if (columnIsSorted === 'desc') {
      return ArrowUpAZIcon
    }
    return ArrowDownUpIcon
  }, [columnIsSorted])

  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>
  }

  return (
    <div className={twMerge('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="h-8 data-[state=open]:bg-secondary [&_svg]:size-4 text-inherit"
            icon={buttonIcon}
            iconPlacement="right"
            size="sm"
            variant="ghost"
          >
            {title}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onSort(false)}>
            <ArrowDownAZIcon className="mr-2 h-3.5 w-3.5 text-primary" />
            Asc
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onSort(true)}>
            <ArrowUpAZIcon className="mr-2 h-3.5 w-3.5 text-primary" />
            Desc
          </DropdownMenuItem>

          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={onHide}>
                <EyeOffIcon className="mr-2 size-3.5 text-primary" />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
