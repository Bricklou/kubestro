import { Badge, Checkbox } from '@kubestro/design-system'
import { createColumnHelper } from '@tanstack/react-table'
import type { Table } from '@tanstack/react-table'
import { useCallback } from 'react'
import { twMerge } from 'tailwind-merge'
import { DataTableColumnHeader } from './table-column-header'
import { TableRowActions } from './table-row-actions'
import type { User, UserProvider, UserStatus } from '~/data/types/user'

function UserIdCheckboxHeader({ table }: { readonly table: Table<User> }) {
  const checkboxSelectedChange = useCallback((value: boolean | 'indeterminate') => {
    table.toggleAllPageRowsSelected(Boolean(value))
  }, [table])

  return (
    <Checkbox
      aria-label="Select all"
      checked={table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')}
      className="translate-y-[2px]"
      onCheckedChange={checkboxSelectedChange}
    />
  )
}

function UserStatusBadge({ status }: { readonly status: UserStatus }) {
  switch (status) {
    case 'active':
      return <Badge variant="primary">Active</Badge>
    case 'inactive':
      return <Badge variant="warning">Inactive</Badge>
    case 'invited':
      return <Badge variant="secondary">Invited</Badge>
    case 'suspended':
      return <Badge variant="danger">Suspended</Badge>
    default:
      return <Badge className="border-dashed" variant="outline">Unknown</Badge>
  }
}

function UserProviderBadge({ provider }: { readonly provider: UserProvider }) {
  switch (provider) {
    case 'local':
      return <Badge variant="primary-soft">Local</Badge>
    case 'oidc':
      return <Badge variant="secondary">OIDC</Badge>
    default:
      return null
  }
}

const columnHelper = createColumnHelper<User>()

export const columns = [
  columnHelper.accessor('username', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    cell: ({ row }) => <span className="truncate max-w-3/6">{row.getValue('username')}</span>,
    meta: {
      className: twMerge(
        'transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      )
    },
    enableHiding: false,
    enableGlobalFilter: true
  }),
  columnHelper.accessor('email', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('email')}</div>,
    enableGlobalFilter: true
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <UserStatusBadge status={row.getValue<UserStatus>('status')} />
  }),
  columnHelper.accessor('provider', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Provider" />,
    cell: ({ row }) => <UserProviderBadge provider={row.getValue<UserProvider>('provider')} />
  }),
  columnHelper.display({
    id: 'actions',
    cell: TableRowActions,
    header: () => <span className="pr-4">Actions</span>,
    meta: {
      className: 'flex justify-end items-center'
    }
  })
]
