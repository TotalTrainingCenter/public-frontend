export interface ICategoryAttributeForm {
  id: number
  key: string
  name: string
  value: string
  orderSeq: string

  // 커스텀마이징
  inputType?: string | undefined
  selectboxOption?: number | undefined
  radioOption?: string
  checkboxOption?: string
  useFile?: string | undefined
  useThumbnail?: string | undefined
}

export const defaultCategoryAttributeForm = reactive<ICategoryAttributeForm>({
  id: 0,
  key: '',
  name: '',
  value: '',
  orderSeq: '',
  inputType: undefined,
  selectboxOption: undefined,
  radioOption: '',
  checkboxOption: '',
  useFile: undefined,
  useThumbnail: undefined,
})
