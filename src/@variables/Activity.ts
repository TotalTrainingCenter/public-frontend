import type { IActivity } from '@entity/Activity'

export interface ActivityForm {
  id: number
  title: string
  description: string
  activityType: string | undefined
  membershipPlanId: number | undefined
  required: boolean
  parentActivity: IActivity | undefined
}

export const defaultForm = reactive<ActivityForm>({
  id: 0,
  title: '',
  description: '',
  activityType: undefined,
  membershipPlanId: undefined,
  required: false,
  parentActivity: undefined,
})
