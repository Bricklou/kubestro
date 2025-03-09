import { useCallback, useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter, linkVariants } from '@kubestro/design-system/components'
import { Link } from 'react-router'

export default function Home({ user }: { readonly user: string }) {
  console.log('Home', user)
  const [counter, setCounter] = useState(0)

  const increaseCounter = useCallback(() => {
    setCounter(old => old + 1)
  }, [setCounter])

  const decreaseCounter = useCallback(() => {
    setCounter(old => old - 1)
  }, [setCounter])

  return (
    <Card className="bg-background-contrast">
      <CardHeader>
        <CardTitle>Hello {user}</CardTitle>

        <CardDescription>
          This box is loaded through federated module!
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-row gap-2 items-center">
        <Button onClick={decreaseCounter} type="button">-</Button>
        <span className="w-8 text-center">{counter}</span>
        <Button onClick={increaseCounter} type="button">+</Button>
      </CardContent>

      <CardFooter>
        <Link className={linkVariants()} to="test">Test</Link>
      </CardFooter>
    </Card>
  )
}
