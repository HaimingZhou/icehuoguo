import { createBrowserRouter } from 'react-router-dom'

import ContainerDetail from './pages/container/Detail'
import ContainerEdit from './pages/container/Edit'
import ContainerList from './pages/container/List'
import ItemDetail from './pages/item/Detail'
import ItemEdit from './pages/item/Edit'
import ItemList from './pages/item/List'
import Layout from './pages/Layout'
import TypeMappingEdit from './pages/mapping/typeMapping/Edit'
import TypeMappingList from './pages/mapping/typeMapping/List'

const routes = createBrowserRouter([
  {
    path: '/item',
    element: <Layout />,
    children: [
      {
        path: '/item/list',
        element: <ItemList />,
      },
      {
        path: '/item/create',
        element: <ItemEdit />,
      },
      {
        path: '/item/edit/:code',
        element: <ItemEdit />,
      },
      {
        path: '/item/detail/:code',
        element: <ItemDetail />,
      },
    ],
  },
  {
    path: '/container',
    element: <Layout />,
    children: [
      {
        path: '/container/list',
        element: <ContainerList />,
      },
      {
        path: '/container/create',
        element: <ContainerEdit />,
      },
      {
        path: '/container/edit/:code',
        element: <ContainerEdit />,
      },
      {
        path: '/container/detail/:code',
        element: <ContainerDetail />,
      },
    ],
  },
  {
    path: '/type-mapping',
    children: [
      {
        path: '/type-mapping/list',
        element: <TypeMappingList />,
      },
      {
        path: '/type-mapping/create',
        element: <TypeMappingEdit />,
      },
      {
        path: '/type-mapping/edit',
        element: <TypeMappingEdit />,
      },
    ],
  },
])

export default routes
