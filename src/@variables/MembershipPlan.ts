export interface IMembershipPlanForm {
  id: number
  name: string
  durationInMonths: number | undefined
  durationInDays: number | undefined
  price: number | undefined
  shortDescription: string
  description: string
  features: string[] | undefined
  status: string
}

export const defaultMembershipPlanForm = reactive<IMembershipPlanForm>({
  id: 0,
  name: '',
  durationInMonths: undefined,
  durationInDays: undefined,
  price: undefined,
  shortDescription: '',
  description: '',
  features: undefined,
  status: 'ACTIVE',
})

export interface IMembershipPlanSelectForm {
  id: number | undefined
}

export const defaultMembershipPlanSelectForm = reactive<IMembershipPlanSelectForm>({
  id: undefined,
})
