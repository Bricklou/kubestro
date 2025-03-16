import { useCallback } from 'react'
import { useUsers } from '../../_context/users-context'
import { UsersActionDialog } from './users-action-dialog'
import { UsersInviteDialog } from './users-invite-dialog'
import { UsersDeleteDialog } from './users-delete-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()

  const onAddOpenChange = useCallback(() => { setOpen('add') }, [setOpen])
  const onInviteOpenChange = useCallback(() => { setOpen('invite') }, [setOpen])
  const onEditOpenChange = useCallback(() => {
    setOpen('edit')
    setTimeout(() => {
      setCurrentRow(null)
    }, 500)
  }, [setCurrentRow, setOpen])
  const onDeleteOpenChange = useCallback(() => {
    setOpen('delete')
    setTimeout(() => {
      setCurrentRow(null)
    }, 500)
  }, [setCurrentRow, setOpen])

  return (
    <>
      <UsersActionDialog
        key="user-add"
        onOpenChange={onAddOpenChange}
        open={open === 'add'}
      />

      <UsersInviteDialog
        key="user-invite"
        onOpenChange={onInviteOpenChange}
        open={open === 'invite'}
      />

      {currentRow ?
        (
          <>
            <UsersActionDialog
              currentRow={currentRow}
              key={`user-edit-${currentRow.id}`}
              onOpenChange={onEditOpenChange}
              open={open === 'edit'}
            />

            <UsersDeleteDialog
              currentRow={currentRow}
              key={`user-delete-${currentRow.id}`}
              onOpenChange={onDeleteOpenChange}
              open={open === 'delete'}
            />
          </>
        ) :
        null}
    </>
  )
}
