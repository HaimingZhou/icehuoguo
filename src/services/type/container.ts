import type { Item } from './item.ts'

export interface ContainerParams {
  code: string
  name: string
  type: string
  url: string
  tags: string[]
  metaData: { label: string; value: string }[]
  associatedItems: string[]
  createdUser: string
  updatedUser: string
}

export interface Container {
  code: string
  name: string
  type: any
  url: string
  previewUrl: string
  tags: string[]
  metaData: { label: string; value: string }[]
  associatedItems: Item[]
  createdUser: any
  updatedUser: any
  _id?: string
}
