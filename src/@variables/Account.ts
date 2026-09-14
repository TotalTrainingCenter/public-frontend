import type { IAccountStatusForm } from './AccountStatus'
import { defaultAccountStatusForm } from './AccountStatus'
import type { IRoleForm } from './Role'

export interface IAccountForm {
  id: number
  username: string
  email: string
  status: IAccountStatusForm
  roles: IRoleForm[] | undefined
}

export const defaultAccountForm = reactive<IAccountForm>({
  id: 0,
  username: '',
  email: '',
  status: { ...defaultAccountStatusForm },
  roles: undefined,
})

export interface IAccountPasswordChangeForm {
  id: number
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export const defaultAccountPasswordChangeForm = reactive<IAccountPasswordChangeForm>({
  id: 0,
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
