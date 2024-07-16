import { request } from '../request'

import type { Container } from '../type'

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
