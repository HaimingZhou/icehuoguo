import axios from 'axios'

import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import type { Request } from './type/request.ts'

export function request<T = any>(config: AxiosRequestConfig) {
  return axios
    .create({
      baseURL: '/api',
    })
    .request<Request<T>, AxiosResponse<Request<T>>>(config)
    .then((res) => res.data)
}
