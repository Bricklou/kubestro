import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@kubestro/design-system'
import type { Row } from '@tanstack/react-table'
import { MoreVerticalIcon, PenIcon, TrashIcon } from 'lucide-react'
import { useCallback } from 'react'
import type { User } from '~/data/types/user'

interface TableRowActionsProps {
  readonly row: Row<User>
}

export function TableRowActions({ row }: TableRowActionsProps) {
  const onEditClick = useCallback(() => {}, [])
  const onDeleteClick = useCallback(() => {}, [])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          className="flex size-8 p-0 data-[state=open]:bg-secondary"
          size="icon"
          variant="ghost"
        >
          <MoreVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={onEditClick}>
          Edit

          <DropdownMenuShortcut>
            <PenIcon className="size-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="!text-danger hover:bg-danger hover:!text-danger-text" onClick={onDeleteClick}>
          Delete
          <DropdownMenuShortcut>
            <TrashIcon className="size-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
