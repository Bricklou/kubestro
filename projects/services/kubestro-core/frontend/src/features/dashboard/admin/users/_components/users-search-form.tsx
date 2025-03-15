import { Button, Input } from '@kubestro/design-system'
import { SearchIcon, XIcon } from 'lucide-react'
import { Form } from 'react-router'
import type { Table } from '@tanstack/react-table'
import { useCallback } from 'react'
import { TableFacetedFilter } from './table-faceted-filter'
import { DataTableViewOptions } from './data-view-options'

interface UsersSearchFormProps<TData> {
  readonly table: Table<TData>
}

export function UsersSearchForm<TData>({ table }: UsersSearchFormProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    table.getColumn('username')?.setFilterValue(event.target.value)
  }, [table])

  const onReset = useCallback(() => {
    table.resetColumnFilters()
  }, [table])

  return (
    <Form className="flex flex-col md:flex-row gap-2 pb-1 items-center" method="get">
      <div className="relative inline-flex items-center w-full md:max-w-96 flex-1">
        <Input
          className="bg-background-contrast pl-8 peer"
          name="search"
          onChange={onInputChange}
          placeholder="Search users..."
          type="search"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
          value={(table.getColumn('username')?.getFilterValue() as string | undefined) ?? ''}
        />

        <SearchIcon className="size-4 left-2 absolute text-text-muted peer-focus-within:text-text" />
      </div>

      <div className="flex gap-x-2">
        <TableFacetedFilter
          column={table.getColumn('status')}
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Invited', value: 'invited' },
            { label: 'Suspended', value: 'suspended' }
          ]}
          title="Status"
        />
      </div>

      {isFiltered ?
        (
          <Button
            className="h-8 px-2 lg:px-3"
            icon={XIcon}
            iconPlacement="right"
            onClick={onReset}
            variant="ghost"
          >
            Reset
          </Button>
        ) :
        null}

      <DataTableViewOptions table={table} />
    </Form>
  )
}
