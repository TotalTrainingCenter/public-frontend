import type { IPermission } from './Permission'

export interface IRole {
  id: number
  name: string
  description: string
  permissions?: IPermission[]
  createdAt?: string
}
