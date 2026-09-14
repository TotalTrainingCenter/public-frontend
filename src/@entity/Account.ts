import type { IAccountStatus } from './AccountStatus'
import type { IRole } from './Role'

export interface IAccount {
  id: number
  username: string
  email: string
  createdAt?: string
}

export interface IAccountList extends IAccount {
  loginTime?: string
  name: string
  gender: string
  identity: string
  ai: string
  planName: string
  startDate?: string
  endDate?: string
  activated: boolean
  banned: boolean
  banReason: string
  banStartDate: string
  banEndDate: string
}

export interface IAccountDetail extends IAccount {
  name?: string
  status: IAccountStatus
  roles: IRole[]
}

export interface IAccountMiniProfile extends IAccount {
  name: string
  roles: IRole[]
  avatar: string
}
