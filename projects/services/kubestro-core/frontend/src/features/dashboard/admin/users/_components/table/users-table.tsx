import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@kubestro/design-system'
import { useReactTable, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, flexRender } from '@tanstack/react-table'
import type { VisibilityState, ColumnFiltersState, SortingState, RowSelectionState, Table as TableData, PaginationState } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import queryString from 'query-string'
import { columns } from './users-columns'
import { DataTablePagination } from './data-table-pagination'
import type { User, UserFields, UserProvider, UserStatus } from '~/data/types/user'
import type { Paginated } from '~/data/types/pagination'

export function useUsersTable(
  data: Paginated<User>,
  page: number,
  filters: {
    search?: string
    provider?: UserProvider[]
    status?: UserStatus[]
  },
  order?: UserFields | `-${UserFields}`

) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const out = []
    if (filters.provider?.length) {
      out.push({ id: 'provider', value: filters.provider })
    }
    if (filters.status?.length) {
      out.push({ id: 'status', value: filters.status })
    }
    return out
  })
  const [sorting, setSorting] = useState<SortingState>(() => {
    if (order) {
      return [{ id: order.startsWith('-') ? order.slice(1) : order, desc: order.startsWith('-') }]
    }
    return []
  })
  const [globalFilter, setGlobalFilter] = useState<string>(filters.search ?? '')
  const [paginationState, setPaginationState] = useState<PaginationState>(
    { pageIndex: page - 1, pageSize: 10 }
  )

  const navigate = useNavigate()

  useEffect(() => {
    const searchParams = queryString.stringify({
      search: globalFilter.length > 0 ? globalFilter : undefined,
      order: sorting.map(({ id, desc }) => (desc ? `-${id}` : id)),
      page: paginationState.pageIndex + 1,
      limit: paginationState.pageSize,
      ...columnFilters.reduce<Record<string, unknown>>(
        (acc, { id, value }) => {
          acc[id] = value
          return acc
        },
        {}
      )
    }, {
      arrayFormat: 'bracket'
    })

    void navigate({
      search: searchParams
    })
  }, [
    globalFilter,
    sorting,
    columnFilters,
    navigate,
    paginationState
  ])

  return useReactTable({
    data: data.items,
    columns,
    pageCount: data.total_pages,
    rowCount: data.total_items,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination: paginationState
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableGlobalFilter: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPaginationState,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onGlobalFilterChange: setGlobalFilter
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

      <DataTablePagination table={table} />
    </div>
  )
}
