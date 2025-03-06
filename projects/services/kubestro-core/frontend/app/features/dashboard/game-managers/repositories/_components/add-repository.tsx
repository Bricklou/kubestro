import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, FormMessage, Input, Label } from '@kubestro/design-system/components'
import { BookPlusIcon } from 'lucide-react'
import { href, useFetcher, useRevalidator } from 'react-router'
import { useEffect, useState } from 'react'
import type { clientAction } from '../repositories'

export function AddRepository() {
  const fetcher = useFetcher<typeof clientAction>()
  const error = fetcher.data?.error
  const submitting = fetcher.state === 'submitting'
  const revalidator = useRevalidator()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (fetcher.data?.ok) {
      setOpen(false)
      void revalidator.revalidate()
    }
  }, [fetcher.data, revalidator])

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button icon={BookPlusIcon} variant="primary-soft">
          Add Repository
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle>Add a new repository</DialogTitle>

          <DialogDescription>
            Add a new repository to retrieve game managers from.
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form
          action={href('/dashboard/game-managers/repositories')}
          className="grid gap-4"
          id="repository-form"
          method="post"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>

            <Input
              disabled={submitting}
              id="name"
              name="name"
              placeholder="Name of the repository"
              required
              type="text"
            />

            {error?.name ?
              <FormMessage error={error.name.detail} /> :
              null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>

            <Input
              disabled={submitting}
              id="url"
              name="url"
              placeholder="URL of the repository"
              required
              type="url"
            />

            {error?.url ?
              <FormMessage error={error.url.detail} /> :
              null}
          </div>
        </fetcher.Form>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button
            disabled={submitting}
            form="repository-form"
            icon={BookPlusIcon}
            loading={submitting}
            type="submit"
            variant="primary"
          >
            Add Repository
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
