import { request } from '../request'

import type { Container, ContainerParams } from '../type'

export const createContainer = (data: Partial<ContainerParams>) => {
  return request<Container>({
    url: '/container/create',
    method: 'post',
    data,
  })
}

export const updateContainer = (data: Partial<ContainerParams>) => {
  return request<Container>({
    url: '/container/update',
    method: 'post',
    data,
  })
}

export const queryByCode = (code?: string) => {
  return request<Container>({
    url: '/container/query-by-code',
    method: 'get',
    params: {
      code,
    },
  })
}

export const queryContainers = (searchVal?: string) => {
  return request<Container[]>({
    url: '/container/query',
    method: 'get',
    params: {
      searchVal,
    },
  })
}
