export interface PageData<T> {
  pageSize: number
  current: number
  total: number
  list: T[]
}
