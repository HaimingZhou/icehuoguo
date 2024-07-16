import { request } from '../request'

import type { Item } from '../type'

export const queryByCode = (code?: string) => {
  return request<Item>({
    url: '/item/query-by-code',
    method: 'get',
    params: {
      code,
    },
  })
}

export const queryItems = (searchVal?: string) => {
  return request<Item[]>({
    url: '/item/query',
    method: 'get',
    params: {
      searchVal,
    },
  })
}
