import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Error from './Error'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world!</div>,
    errorElement: <Error />,
  },
  {
    path: '/react',
    element: <div>Hello react!</div>,
  },
])

function App() {
  return (
    <StrictMode>
      <RouterProvider router={routes} />
    </StrictMode>
  )
}

export default App
