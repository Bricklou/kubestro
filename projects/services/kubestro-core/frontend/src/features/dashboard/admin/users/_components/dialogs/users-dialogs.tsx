import { useCallback } from 'react'
import { useUsers } from '../../_context/users-context'
import { UsersActionDialog } from './users-action-dialog'
import { UsersInviteDialog } from './users-invite-dialog'
import { UsersDeleteDialog } from './users-delete-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()

  const close = useCallback(() => {
    console.trace('close')
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
    }, 500)
  }, [setCurrentRow, setOpen])

  const onAddOpenChange = useCallback((value: boolean) => {
    if (value) setOpen('add')
    else close()
  }, [setOpen, close])
  const onInviteOpenChange = useCallback((value: boolean) => {
    if (value) setOpen('invite')
    else close()
  }, [setOpen, close])
  const onEditOpenChange = useCallback((value: boolean) => {
    console.log('onEditOpenChange', value)
    if (value) setOpen('edit')
    else close()
  }, [close, setOpen])

  const onDeleteOpenChange = useCallback((value: boolean) => {
    console.log('onDeleteOpenChange', value)
    if (value) setOpen('delete')
    else close()
  }, [close, setOpen])

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
