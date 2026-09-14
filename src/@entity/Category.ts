import type { ICategoryAttribute } from './CategoryAttribute'
import type { ICategorySetting } from './CategorySetting'

export interface ICategory {
  id: number
  key: string
  name: string
  orderSeq: number
  attributes: ICategoryAttribute[]
  settings: ICategorySetting[]
  createdAt?: string
}

export interface ICategoryWithSetting extends ICategory, ICategorySetting {
  targetRoleId: number
  targetDomainId: number
}
