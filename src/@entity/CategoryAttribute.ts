import type { ICategory } from './Category'

export interface ICategoryAttribute {
  id: number
  category: ICategory
  key: string
  name: string
  value: string
  orderSeq: number
  createdAt: string
}

export interface ICategoryAttributeCustom extends ICategoryAttribute {
  inputType: string
  selectboxOption: number
  radioOption: string
  checkboxOption: string
  useFile: string
  useThumbnail: string
}
