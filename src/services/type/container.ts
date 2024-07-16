export interface Container {
  code: string
  name: string
  type: any
  url: string
  tags: string[]
  extData: Record<string, string>
  associatedItems: any
  createdUser: any
  updatedUser: any
}
