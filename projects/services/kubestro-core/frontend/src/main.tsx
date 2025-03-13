import { startTransition, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import App from './App.tsx'

startTransition(() => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- root element is always present
  const rootEl = document.getElementById('root')!

  const root = createRoot(rootEl)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
