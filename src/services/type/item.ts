export interface Item {
  code: string
  name: string
  type: any
  url: string
  tags: string[]
  metaData: Record<string, string>
  extData: Record<string, string>
  relatedContainer: any
  createdUser: any
  updatedUser: any
}
