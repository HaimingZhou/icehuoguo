import type { Container } from './container.ts'

export interface ItemParams {
  code: string
  name: string
  type: any
  url: string
  tags: string[]
  metaData: { label: string; value: string }[]
  extData: Record<string, string>
  relatedContainer: string
  createdUser: string
  updatedUser: string
}

export interface Item {
  code: string
  name: string
  type: any
  url: string
  previewUrl: string
  tags: string[]
  metaData: { label: string; value: string }[]
  extData: Record<string, string>
  relatedContainer: Container
  createdUser: any
  updatedUser: any
  _id?: string
}
