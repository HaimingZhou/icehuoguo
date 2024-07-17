import { request } from '../request'

import type { Item, ItemParams } from '../type'

export const createItem = (data: Partial<ItemParams>) => {
  return request<Item>({
    url: '/item/create',
    method: 'post',
    data,
  })
}

export const updateItem = (data: Partial<ItemParams>) => {
  return request<Item>({
    url: '/item/update',
    method: 'post',
    data,
  })
}

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
