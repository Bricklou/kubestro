import { unstable_createContext } from 'react-router'
import type { ServiceStatus } from '~/data/types/global'
import type { User } from '~/data/types/user'

export const userContext = unstable_createContext<User>()
export const statusContext = unstable_createContext<ServiceStatus>()
