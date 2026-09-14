import type { IFeature } from './Feature'

export interface IMembershipPlan {
  id: number
  name: string
  durationInMonths: number
  durationInDays: number
  price: number
  shortDescription: string
  description: string
  status: string
  features: IFeature[]
  createdAt: string
}
