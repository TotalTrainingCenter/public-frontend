export interface IPermissionGroupForm {
  id: number
  name: string
}

export const defaultPermissionGroupForm = reactive<IPermissionGroupForm>({
  id: 0,
  name: '',
})
