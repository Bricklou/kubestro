import { createContext, useContext, useState } from 'react'
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import type { User } from '~/data/types/user'
import useDialogState from '~/hooks/use-dialog-state'

export type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface UsersContextType {
  open: UsersDialogType | null
  setOpen: (_type: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: Dispatch<SetStateAction<User | null>>
}

const UsersContext = createContext<UsersContextType | null>(null)

type UsersProviderProps = PropsWithChildren

export function UsersProvider({ children }: UsersProviderProps) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  return (
    <UsersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </UsersContext>
  )
}

export function useUsers() {
  const usersContext = useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers must be used within a UsersProvider')
  }

  return usersContext
}
