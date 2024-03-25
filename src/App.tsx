import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world!</div>,
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
