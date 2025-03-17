import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormMessage, Input, Label, ScrollArea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kubestro/design-system'
import { SaveIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useFetcher } from 'react-router'
import type { CreateUserAction } from '../../_actions/users-create'
import type { UpdateUserAction } from '../../_actions/users-update'
import type { User } from '~/data/types/user'

interface UsersActionDialogProps {
  readonly currentRow?: User
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: UsersActionDialogProps) {
  const isEdit = Boolean(currentRow)

  const fetcher = useFetcher<CreateUserAction | UpdateUserAction>()
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
          <DialogTitle>{isEdit ? 'Edit User' : 'Add a new user'}</DialogTitle>

          <DialogDescription className="text-text-muted">
            {isEdit ? 'Update the user here. ' : 'Create a new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="-mr-4 w-full max-h-[50vh] py-1 pr-4">
          <fetcher.Form
            action={isEdit && currentRow ? `/dashboard/admin/users/${currentRow.id}/update` : '/dashboard/admin/users/create'}
            className="space-y-4 p-0.5"
            id="user-form"
            method={isEdit ? 'put' : 'post'}
          >
            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
              <Label htmlFor="username">Username</Label>

              <Input
                autoComplete="off"
                className="col-span-4 col-start-3"
                defaultValue={currentRow?.username}
                id="username"
                name="username"
                placeholder="johndoe"
                required
              />

              {error && 'username' in error ?
                <FormMessage error={error.username.detail} /> :
                null}
            </div>

            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
              <Label htmlFor="email">Email</Label>

              <Input
                autoComplete="off"
                className="col-span-4 col-start-3"
                defaultValue={currentRow?.email}
                id="email"
                name="email"
                placeholder="john.doe@acme.com"
                required
                type="email"
              />

              {error && 'email' in error ?
                <FormMessage error={error.email.detail} /> :
                null}
            </div>

            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
              <Label htmlFor="password">Password</Label>

              <Input
                autoComplete="off"
                className="col-span-4 col-start-3"
                id="password"
                name="password"
                placeholder="Password"
                required
                type="password"
              />
            </div>

            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
              <Label htmlFor="status">Status</Label>

              <Select
                defaultValue={currentRow?.status}
                name="status"
                required
              >
                <SelectTrigger className="col-span-4 col-start-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </fetcher.Form>
        </ScrollArea>

        <DialogFooter>
          <Button form="user-form" icon={SaveIcon} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
