import { Button, linkVariants } from '@kubestro/design-system'
import { Bolt } from 'lucide-react'
import { useCallback } from 'react'
import { Link } from 'react-router'

export function meta() {
  return [
    { title: 'New React Router App' },
    {
      name: 'description',
      content: 'Welcome to React Router!'
    }
  ]
}

export default function Home() {
  const onClick = useCallback(() => {
    console.log('Hello!')
  }, [])

  return (
    <div className="p-8">
      <Button
        icon={<Bolt />}
        onClick={onClick}
        size="lg"
        variant="primary"
      >
        Hello
      </Button>

      <p>
        <Link className={linkVariants()} to="/test">Go to /test</Link>
      </p>
    </div>
  )
}
