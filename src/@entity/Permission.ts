import type { IPermissionGroup } from './PermissionGroup'

export interface IPermission {
  id: number
  group: IPermissionGroup
  subject: string
  description: string
  actions: string[]
  createdAt?: string
}
