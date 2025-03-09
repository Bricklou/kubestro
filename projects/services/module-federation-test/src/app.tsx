import { Route, Routes } from 'react-router'
import Home from './routes/home'
import './app.css'
import Test from './routes/test'

export default function App({ user }: { readonly user: string }) {
  return (
    <Routes>
      <Route element={<Home user={user} />} index />
      <Route element={<Test />} path="test" />
    </Routes>
  )
}
