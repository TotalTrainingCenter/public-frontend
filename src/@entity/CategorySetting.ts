import type { ICategory } from './Category'

export interface ICategorySetting {
  id: number
  category: ICategory
  dashboard: boolean
  public: boolean
  onlyRole: boolean
  targetRoles?: string[]
  onlyDomain: boolean
  targetDomains?: string[]
  createdAt?: string
}
