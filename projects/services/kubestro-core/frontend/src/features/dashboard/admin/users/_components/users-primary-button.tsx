import { Button } from '@kubestro/design-system/components'
import { MailPlusIcon, UserPlusIcon } from 'lucide-react'
import { useCallback } from 'react'

export function UsersPrimaryButton() {
  const onInviteClick = useCallback(() => {
    console.log('Invite clicked')
  }, [])

  const onAddUserClick = useCallback(() => {
    console.log('Add user clicked')
  }, [])

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
