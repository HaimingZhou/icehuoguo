export interface Request<T = any> {
  success: boolean
  data: T
  errCode?: string
  errMessage?: string
}
