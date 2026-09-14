export interface IInformationDefaultForm {
  id: number
  name: string
  schoolName: string
  companyName: string
  level: string
  birthday: Date | null
  height: string
  weight: string
  gender: string | undefined
  identity: string | undefined
}

export const defaultInformationDefaultForm = reactive<IInformationDefaultForm>({
  id: 0,
  name: '',
  schoolName: '',
  companyName: '',
  level: '',
  birthday: null,
  height: '',
  weight: '',
  gender: undefined,
  identity: undefined,
})

export interface IInformationLivingAndActivityForm {

  // experience: string | undefined
  // masturbation: string
  // poo: string
  // pee: string
  // propensity: string
  // preferred: string
  // nonPreferred: string
  // toilet: string | undefined
  // determination: string

  id: number
  wakeupTime: Date | null
  bedTime: Date | null
  workTime: Date | null
  exercise: string | undefined
  exerciseNumber: string
  preferredExercise: string
  preferredActivity: string
  controlPreference: string | undefined
  aiLearningStatus: string | undefined
  activeHours: string
  weekendStyle: string
  targetType: string
  option: string[] | undefined
}

export const defaultInformationLivingAndActivityForm = reactive<IInformationLivingAndActivityForm>({
  id: 0,
  wakeupTime: null,
  bedTime: null,
  workTime: null,
  exercise: undefined,
  exerciseNumber: '',
  preferredExercise: '',
  preferredActivity: '',
  controlPreference: undefined,
  aiLearningStatus: undefined,
  activeHours: '',
  weekendStyle: '',
  targetType: '',
  option: undefined,
})

export interface IInformationSensitiveForm {
  id: number
  realPostno: string
  realAddress: string
  realAddressDetail: string
  postno: string
  address: string
  addressDetail: string
  phone: string
  birthTime: Date | null
  face1: string
  face2: string
  studentCardFront: string
  studentCardBack: string
  idCardFront: string
  idCardBack: string
  [key: string]: any
}

export const defaultInformationSensitiveForm = reactive<IInformationSensitiveForm>({
  id: 0,
  realPostno: '',
  realAddress: '',
  realAddressDetail: '',
  postno: '',
  address: '',
  addressDetail: '',
  phone: '',
  birthTime: null,
  face1: '',
  face2: '',
  studentCardFront: '',
  studentCardBack: '',
  idCardFront: '',
  idCardBack: '',
})
