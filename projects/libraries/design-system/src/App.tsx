import { useCallback, useState } from 'react'
import viteLogo from '../../../../../../../../../../vite.svg'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const onClick = useCallback(() => {
    setCount(_count => _count + 1)
  }, [setCount])

  return (
    <>
      <div>
        <a href="https://vite.dev" rel="noreferrer" target="_blank">
          <img alt="Vite logo" className="logo" src={viteLogo} />
        </a>

        <a href="https://react.dev" rel="noreferrer" target="_blank">
          <img alt="React logo" className="logo react" src={reactLogo} />
        </a>
      </div>

      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={onClick} type="button">
          count is
          {' '}
          {count}
        </button>

        <p>
          Edit
          {' '}
          <code>src/App.tsx</code>
          {' '}
          and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
