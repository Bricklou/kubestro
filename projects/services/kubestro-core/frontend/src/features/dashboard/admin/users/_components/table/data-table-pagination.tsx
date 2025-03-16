import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kubestro/design-system'
import type { Table } from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import { useCallback } from 'react'

interface DataTablePaginationProps<TData> {
  readonly table: Table<TData>
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const setPageSize = useCallback((value: string) => {
    table.setPageSize(Number(value))
  }, [table])

  const goToFirstPage = useCallback(() => {
    table.setPageIndex(0)
  }, [table])

  const goToPreviousPage = useCallback(
    () => {
      table.previousPage()
    },
    [table]
  )

  const goToNextPage = useCallback(() => {
    table.nextPage()
  }, [table])

  const goToLastPage = useCallback(
    () => {
      table.setPageIndex(table.getPageCount() - 1)
    },
    [table]
  )

  return (
    <div
      className="flex items-center justify-between overflow-clip px-2"
      style={{ overflowClipMargin: 1 }}
    >
      <div className="hidden flex-1 text-sm text-muted-foreground sm:block">
        {table.getFilteredSelectedRowModel().rows.length}
        {' '}
        of
        {' '}
        {table.getFilteredRowModel().rows.length}
        {' '}
        row(s) selected.
      </div>

      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>

          <Select
            onValueChange={setPageSize}
            value={table.getState().pagination.pageSize.toString()}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>

            <SelectContent side="top">
              {[10,
                20,
                30,
                40,
                50].map(pageSize => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page
          {' '}
          {table.getState().pagination.pageIndex + 1}
          {' '}
          of
          {' '}
          {table.getPageCount()}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={!table.getCanPreviousPage()}
            onClick={goToFirstPage}
            variant="secondary"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>

          <Button
            className="h-8 w-8 p-0"
            disabled={!table.getCanPreviousPage()}
            onClick={goToPreviousPage}
            variant="secondary"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <Button
            className="h-8 w-8 p-0"
            disabled={!table.getCanNextPage()}
            onClick={goToNextPage}
            variant="secondary"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>

          <Button
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={!table.getCanNextPage()}
            onClick={goToLastPage}
            variant="secondary"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
