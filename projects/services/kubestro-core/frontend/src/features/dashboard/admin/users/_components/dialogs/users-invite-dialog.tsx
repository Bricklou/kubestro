import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormMessage, Input, Label, Textarea } from '@kubestro/design-system'
import { MailPlusIcon, SendHorizontalIcon } from 'lucide-react'
import { useCallback, useRef } from 'react'
import { useFetcher } from 'react-router'

interface UsersInviteDialogProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

export function UsersInviteDialog({ open, onOpenChange }: UsersInviteDialogProps) {
  const fetcher = useFetcher<{ error: Record<string, { detail: string }> }>()
  const error = fetcher.data?.error

  const formRef = useRef<HTMLFormElement>(null)

  const onDialogOpenChange = useCallback((state: boolean) => {
    formRef.current?.reset()
    onOpenChange(state)
  }, [onOpenChange])

  return (
    <Dialog
      onOpenChange={onOpenChange}
      open={open}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <MailPlusIcon className="size-4" />
            Invite User
          </DialogTitle>

          <DialogDescription className="text-text-muted">
            Invite new user to join your team by sending them an email invitation.
            Assign a role to defne their access level.
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form
          className="grid gap-4"
          id="user-form"
          method="post"
          ref={formRef}
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
            <Textarea className="resize-none" placeholder="Add a personal note to your invitation (optional)" />
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
