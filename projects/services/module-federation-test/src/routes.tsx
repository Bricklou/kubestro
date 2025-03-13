import type { RouteObject } from 'react-router'
import { LayoutDashboardIcon } from 'lucide-react'
import Home from './routes/home'
import './app.css'
import Test from './routes/test'

function loader() {
  console.log('hello world from loader')
}

export const routeObject: RouteObject = {
  id: 'my-module',
  path: 'mf-test',
  children: [
    {
      element: <Home user="demo" />,
      index: true,
      loader
    },
    {
      path: 'test',
      element: <Test />,
      loader
    }
  ]
}

export const sidebarItems = [
  {
    title: 'Test',
    items: [
      {
        title: 'Module Federation Test',
        to: '/dashboard/mf-test',
        icon: LayoutDashboardIcon
      }
    ]
  }
]
