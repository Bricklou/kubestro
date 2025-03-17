import { Alert, AlertDescription, AlertTitle, Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label } from '@kubestro/design-system'
import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useFetcher } from 'react-router'
import type { DeleteUserAction } from '../../_actions/users-delete'
import type { User } from '~/data/types/user'

interface UsersDeleteDialogProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly currentRow: User
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: UsersDeleteDialogProps) {
  const [value, setValue] = useState('')

  const fetcher = useFetcher<DeleteUserAction>()

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, [])

  useEffect(() => {
    if (fetcher.data) {
      onOpenChange(false)
    }
  }, [fetcher.data, onOpenChange])

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader className="gap-x-2">
          <DialogTitle>
            Are your sure you want to delete the user <strong>{currentRow.username}</strong>?
          </DialogTitle>

          <DialogDescription className="text-text-muted">
            This action will permanently delete the user from the system. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="delete-confirmation">
          Please type the username <pre className="inline border border-border px-1 py-0.5 rounded-md">{currentRow.username}</pre> to confirm:
        </Label>

        <Input
          id="delete-confirmation"
          onChange={onChange}
          placeholder="Type the username"
          required
          type="text"
          value={value}
        />

        <Alert variant="danger">
          <AlertTitle>Warning!</AlertTitle>

          <AlertDescription>
            Please be careful, this operation can not be rolled back.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>

          <fetcher.Form action={`/dashboard/admin/users/${currentRow.id}/delete`} method="delete">
            <Button disabled={value.trim() !== currentRow.username} type="submit" variant="danger">Delete</Button>
          </fetcher.Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
