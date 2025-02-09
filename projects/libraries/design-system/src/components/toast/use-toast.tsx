import { useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import type { ToastActionElement, ToastProps } from './toast'

// Time before the toast is removed (in microseconds)
const TOAST_REMOVE_DELAY = 1_000_000

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToasterToast = ToastProps & {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ToastActionElement
}

let count = 0

function genToastId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Action = {
  type: 'ADD_TOAST'
  toast: ToasterToast
} | {
  type: 'UPDATE_TOAST'
  toast: Partial<ToasterToast>
} | {
  type: 'DISMISS_TOAST'
  toastId?: ToasterToast['id']
} | {
  type: 'REMOVE_TOAST'
  toastId?: ToasterToast['id']
}

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- This is not possible, there's a circular dependency between the functions
    dispatch({
      type: 'REMOVE_TOAST',
      toastId
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts]
      }
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(t => (t.id === action.toast.id ?
          {
            ...t,
            ...action.toast
          } :
          t))
      }
    case 'DISMISS_TOAST': {
      const { toastId } = action

      /*
       * ! Side Effect ! - This could be extracted into a dismissToast() action,
       * But I'll keep it here for simplicity
       */
      if (toastId) addToRemoveQueue(toastId)

      else {
        state.toasts.forEach((t) => {
          addToRemoveQueue(t.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map(t => (t.id === toastId || toastId === undefined ?
          {
            ...t,
            open: false
          } :
          t))
      }
    }
    case 'REMOVE_TOAST': {
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: []
        }
      }

      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId)
      }
    }
    default:
      return state
  }
}

const listeners: ((state: State) => void)[] = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  if (action.type === 'ADD_TOAST') {
    const toastExists = memoryState.toasts.some(t => t.id === action.toast.id)
    if (toastExists) return
  }

  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => { listener(memoryState) })
}

type Toast = Omit<ToasterToast, 'id'>

export function toast(props: Toast & { id?: string }) {
  const id = props.id ?? genToastId()

  const update = (toasterProps: Toast) => {
    dispatch({
      type: 'UPDATE_TOAST',
      toast: {
        ...toasterProps,
        id
      }
    })
  }

  const dismiss = () => {
    dispatch({
      type: 'DISMISS_TOAST',
      toastId: id
    })
  }

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      }
    }
  })

  return {
    id,
    dismiss,
    update
  }
}

function subscribe(listener: (state: State) => void) {
  listeners.push(listener)

  return () => {
    const index = listeners.indexOf(listener)

    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}

export function useToast() {
  const state = useSyncExternalStore(subscribe, () => memoryState)

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      dispatch({
        type: 'DISMISS_TOAST',
        toastId
      })
    }
  }
}
