import { useEffect, useState } from 'react'

export function useScrollPosition() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    document.addEventListener('scroll', () => {
      setOffset(window.scrollY)
    }, {
      passive: true,
      signal: controller.signal
    })

    return () => {
      controller.abort()
    }
  }, [])

  return offset
}
