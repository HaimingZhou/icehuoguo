import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Error from './Error'

import Hanoi from './pages/toyBox/Hanoi'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <h1 className="text-3xl font-bold underline">Hello world!</h1>,
    errorElement: <Error />,
  },
  {
    path: '/react',
    element: <div>Hello react!</div>,
  },
  {
    path: '/hanoi',
    element: <Hanoi />,
  },
])

function App() {
  return <RouterProvider router={routes} />
}

export default App
