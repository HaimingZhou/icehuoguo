import { request } from '../request'

import type { TypeMapping } from '../type'

export const createTypeMapping = (data: Partial<TypeMapping>) => {
  return request({
    url: '/type-mapping/create',
    method: 'post',
    data,
  })
}

export const updateTypeMapping = (data: Partial<TypeMapping> & { id: string }) => {
  return request({
    url: '/type-mapping/update',
    method: 'post',
    data,
  })
}

export const queryTypeMappingByCode = (code: string) => {
  return request<TypeMapping>({
    url: '/type-mapping/query-by-code',
    method: 'get',
    params: { code },
  })
}

export const queryTypeMapping = () => {
  return request<TypeMapping[]>({
    url: '/type-mapping/query',
    method: 'get',
  })
}

export const checkTypeMappingCode = (code: string) => {
  return request<boolean>({
    url: '/type-mapping/check-code',
    method: 'post',
    data: { code },
  })
}
