import type { IPermissionForm } from './Permission'

export interface IRoleForm {
  id: number
  name: string
  description: string
  permissions: IPermissionForm[] | undefined
}

export const defaultRoleForm = reactive<IRoleForm>({
  id: 0,
  name: '',
  description: '',
  permissions: undefined,
})
