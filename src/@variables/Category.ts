import type { ICategoryAttributeForm } from './CategoryAttribute'

export interface ICategoryForm {
  id: number
  key: string
  name: string
  orderSeq: string
  attributes: ICategoryAttributeForm[]
}

export const defaultCategoryForm = reactive<ICategoryForm>({
  id: 0,
  key: '',
  name: '',
  orderSeq: '',
  attributes: [],
})
