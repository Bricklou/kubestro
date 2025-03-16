import { Button } from '@kubestro/design-system/components'
import { MailPlusIcon, UserPlusIcon } from 'lucide-react'
import { useCallback } from 'react'
import { useUsers } from '../_context/users-context'

export function UsersPrimaryButton() {
  const { setOpen } = useUsers()

  const onInviteClick = useCallback(() => { setOpen('invite') }, [setOpen])
  const onAddUserClick = useCallback(() => { setOpen('add') }, [setOpen])

  return (
    <div className="flex flex-row gap-2 flex-1 @lg:flex-initial">
      <Button
        className="flex-1"
        icon={MailPlusIcon}
        onClick={onInviteClick}
        size="sm"
        variant="secondary"
      >
        Invite User
      </Button>

      <Button
        className="flex-1"
        icon={UserPlusIcon}
        onClick={onAddUserClick}
        size="sm"
      >
        Add User
      </Button>
    </div>
  )
}
