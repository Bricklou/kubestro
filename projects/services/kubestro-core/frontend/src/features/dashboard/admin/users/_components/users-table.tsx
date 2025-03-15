import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@kubestro/design-system'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, getFacetedRowModel, getFacetedUniqueValues, flexRender } from '@tanstack/react-table'
import type { VisibilityState, ColumnFiltersState, SortingState, RowSelectionState, Table as TableData } from '@tanstack/react-table'
import { useState } from 'react'
import { columns } from './users-columns'
import type { User } from '~/data/types/user'

export function useUsersTable(data: User[]) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  return useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })
}

interface DataTableProps {
  readonly table: TableData<User>
}

export function UsersTable({ table }: DataTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow className="group/row" key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    // @ts-expect-error -- Typescript can't infer the type of the meta property
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    className={header.column.columnDef.meta?.className ?? ''}
                    colSpan={header.colSpan}
                    key={header.id}
                  >
                    {header.isPlaceholder ?
                      null :
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>

            {table.getRowModel().rows.length ?
              (
                table.getRowModel().rows.map(row => (
                  <TableRow className="group/row" data-state={row.getIsSelected() && 'selected'} key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        // @ts-expect-error -- Typescript can't infer the type of the meta property
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        className={cell.column.columnDef.meta?.className ?? ''}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) :
              (
                <TableRow className="hover:!bg-inherit" key="user-no-data">
                  <TableCell className="h-24 text-center" colSpan={columns.length}>
                    No users found.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
