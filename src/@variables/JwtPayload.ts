import type { IMembershipPlan } from '@entity/MembershipPlan'
import type { IPermission } from '@entity/Permission'
import type { IRole } from '@entity/Role'

export interface JwtPayload {
  sub: string
  iat: number
  exp: number
  account: {
    id: number
    username: string
    resetPassword: boolean
    email: string
    emailConfirm: boolean
    changeInformation: boolean
    roles: IRole[]
    permissions: IPermission[]
    membershipPlan: IMembershipPlan | null
  }
}
