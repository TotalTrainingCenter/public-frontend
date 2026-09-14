export interface ICodeGroupForm {
  id: number
  name: string
  os: boolean | undefined
}

export const defaultCodeGroupForm = reactive<ICodeGroupForm>({
  id: 0,
  name: '',
  os: undefined,
})
