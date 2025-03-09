import { linkVariants } from '@kubestro/design-system'
import { Link } from 'react-router'

export default function Test() {
  console.log('Test')
  return (
    <div>
      <p>This is a test</p>
      <Link className={linkVariants()} to="/dashboard/mf-test">Home</Link>
    </div>
  )
}
