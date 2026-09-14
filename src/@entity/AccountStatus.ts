import type { IAccount } from './Account'

export interface IAccountStatus {
  id: number
  account: IAccount
  activated: boolean
  banned: boolean
  banReason: string
  banStartDate: string
  banEndDate: string
  createdAt: string
}
