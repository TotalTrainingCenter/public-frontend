export interface IPermissionForm {
  id: number
  subject: string
  description: string
  actions: string[]
}

export const defaultPermissionForm = reactive<IPermissionForm>({
  id: 0,
  subject: '',
  description: '',
  actions: [],
})
