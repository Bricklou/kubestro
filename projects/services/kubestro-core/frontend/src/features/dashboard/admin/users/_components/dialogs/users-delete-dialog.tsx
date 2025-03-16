import { Alert, AlertDescription, AlertTitle, Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, toast } from '@kubestro/design-system'
import { useCallback, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { User } from '~/data/types/user'

interface UsersDeleteDialogProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly currentRow: User
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: UsersDeleteDialogProps) {
  const [value, setValue] = useState('')

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, [])

  const handleDelete = useCallback(() => {
    if (value.trim() !== currentRow.username) return

    onOpenChange(false)

    toast({
      title: `The user "${currentRow.username}" has been deleted:`,
      variant: 'success'
    })
  }, [currentRow.username, onOpenChange, value])

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
            <Button variant="ghost">Cancel</Button>
          </DialogClose>

          <Button disabled={value.trim() !== currentRow.username} onClick={handleDelete} variant="danger">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
