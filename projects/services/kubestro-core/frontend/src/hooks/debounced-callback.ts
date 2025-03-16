import { useCallback, useEffect, useRef } from 'react'

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  dependencies: React.DependencyList,
  delay: number
) {
  const handleRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const debouncedCallback = useCallback((...args: Args) => {
    if (handleRef.current) {
      clearTimeout(handleRef.current)
    }

    handleRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, dependencies, delay])

  // Cleanup
  useEffect(() => {
    return () => {
      if (handleRef.current) {
        clearTimeout(handleRef.current)
      }
    }
  }, [])

  return debouncedCallback
}
