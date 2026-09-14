import type { IMembershipPlan } from './MembershipPlan'

export interface IActivity {
  id: number
  title: string
  description: string
  activityType: string
  membershipPlans: IMembershipPlan[]
  required: boolean
  activated: boolean
  parentActivity?: IActivity | undefined
  createdAt: string
}
