export interface FeatureForm {
  id: number
  name: string
  description: string
  status: string
}

export const defaultForm = reactive<FeatureForm>({
  id: 0,
  name: '',
  description: '',
  status: 'ACTIVE',
})
