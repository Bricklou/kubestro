import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormMessage, Input, Label, Textarea } from '@kubestro/design-system'
import { SendHorizontalIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useFetcher } from 'react-router'
import type { InviteUserAction } from '../../_actions/users-invite'

interface UsersInviteDialogProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

export function UsersInviteDialog({ open, onOpenChange }: UsersInviteDialogProps) {
  const fetcher = useFetcher<InviteUserAction>()
  const error = fetcher.data?.error

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.ok) {
      onOpenChange(false)
    }
  }, [fetcher.data, fetcher.state, onOpenChange])

  return (
    <Dialog
      onOpenChange={onOpenChange}
      open={open}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>
            Invite User
          </DialogTitle>

          <DialogDescription className="text-text-muted">
            Invite new user to join your team by sending them an email invitation.
            Assign a role to define their access level.
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form
          action="/dashboard/admin/users/invite"
          className="grid gap-4"
          id="user-invite-form"
          method="post"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>

            <Input
              autoComplete="off"
              id="email"
              name="email"
              placeholder="john.doe@acme.com"
              required
            />

            {error && 'email' in error ?
              <FormMessage error={error.email.detail} /> :
              null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea className="resize-none" maxLength={1000} placeholder="Add a personal note to your invitation (optional)" />

            {error && 'description' in error ?
              <FormMessage error={error.description.detail} /> :
              null}
          </div>
        </fetcher.Form>

        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>

          <Button
            form="user-invite-form"
            icon={SendHorizontalIcon}
            iconPlacement="right"
            type="submit"
          >
            Invite
          </Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )
}
