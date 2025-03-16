import { Button, Input } from '@kubestro/design-system'
import { SearchIcon, XIcon } from 'lucide-react'
import { Form } from 'react-router'
import type { Table } from '@tanstack/react-table'
import { useCallback } from 'react'
import { TableFacetedFilter } from './table/table-faceted-filter'
import { DataTableViewOptions } from './table/data-view-options'
import { useDebouncedCallback } from '~/hooks/debounced-callback'

interface UsersSearchFormProps<TData> {
  readonly table: Table<TData>
  readonly search?: string
}

export function UsersSearchForm<TData>({ table, search }: UsersSearchFormProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const onInputChange = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    table.setGlobalFilter(String(event.target.value))
  }, [table], 500)

  const onReset = useCallback(() => {
    table.resetColumnFilters()
  }, [table])

  return (
    <Form className="flex flex-col md:flex-row gap-2 pb-1 items-center" method="get">
      <div className="relative inline-flex items-center w-full md:max-w-96 flex-1">
        <Input
          className="bg-background-contrast pl-8 peer"
          defaultValue={search}
          name="search"
          onChange={onInputChange}
          placeholder="Search users..."
          type="search"
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

        <TableFacetedFilter
          column={table.getColumn('provider')}
          options={[
            { label: 'Local', value: 'local' },
            { label: 'OIDC', value: 'oidc' }
          ]}
          title="Provider"
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
