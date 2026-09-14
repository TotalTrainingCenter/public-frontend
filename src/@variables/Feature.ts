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

export const featureStatus = [
  { title: '정식 운영', value: 'ACTIVE' },
  { title: '베타', value: 'BETA' },
  { title: '개발중', value: 'DEVELOPMENT' },
  { title: '기획중', value: 'PLANNING' },
  { title: '미 문영', value: 'INACTIVE' },
]
