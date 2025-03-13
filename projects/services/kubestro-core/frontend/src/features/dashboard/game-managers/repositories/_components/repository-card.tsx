import { Button, Card, CardDescription, CardFooter, CardHeader, CardTitle, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, linkVariants, Tooltip, TooltipContent, TooltipTrigger } from '@kubestro/design-system/components'
import { TrashIcon } from 'lucide-react'
import { href, useFetcher, useRevalidator } from 'react-router'
import { useEffect, useState } from 'react'
import type { deleteRepositoryAction } from '../repository-action'
import type { Repository } from '~/data/types/repositories'

export interface RepositoryCardProps {
  readonly repository: Repository
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  const fetcher = useFetcher<typeof deleteRepositoryAction>()
  const revalidator = useRevalidator()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (fetcher.data?.ok) {
      setOpen(false)
      void revalidator.revalidate()
    }
  }, [fetcher.data, revalidator])

  return (
    <Card className="flex flex-col md:flex-row bg-background-contrast">
      <CardHeader className="flex-1">
        <CardTitle>{repository.name}</CardTitle>

        <CardDescription>
          <a
            className={linkVariants()}
            href={repository.url}
            rel="noreferrer"
            target="_blank"
          >
            {repository.url}
          </a>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Dialog onOpenChange={setOpen} open={open}>
          <Tooltip>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <TrashIcon />
                </Button>
              </TooltipTrigger>
            </DialogTrigger>

            <TooltipContent>
              Delete
            </TooltipContent>
          </Tooltip>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete the repository?
              </DialogTitle>

              <DialogDescription className="text-text-muted">
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>

              <fetcher.Form action={href('/dashboard/game-managers/repositories/:id', { id: repository.id })} method="delete">
                <Button icon={TrashIcon} type="submit" variant="danger">Delete</Button>
              </fetcher.Form>
            </DialogFooter>
          </DialogContent>

        </Dialog>
      </CardFooter>
    </Card>
  )
}
