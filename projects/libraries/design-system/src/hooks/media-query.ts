import { useEffect, useState } from 'react'
import { MEDIA_QUERIES } from '@/utils/constants'

export function useMediaQuery(query: keyof typeof MEDIA_QUERIES) {
  const [matches, setMatches] = useState<boolean | null>(null)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(MEDIA_QUERIES[query])
    const listener = () => { setMatches(Boolean(mediaQueryList.matches)) }
    listener()
    const controller = new AbortController()
    mediaQueryList.addEventListener('change', listener, { signal: controller.signal })
    return () => { controller.abort() }
  }, [query])

  return matches
}
