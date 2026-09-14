export interface IUploadForm {
  filePath: string
  fileName: string
  fileSize: number | undefined
  fileType: string
  description: string
}

export const defaultUploadForm = reactive<IUploadForm>({
  filePath: '',
  fileName: '',
  fileSize: undefined,
  fileType: '',
  description: '',
})

export interface IMediaForm {
  face1?: File | undefined
  face2?: File | undefined
  studentCardFront: File | undefined
  studentCardBack: File | undefined
  idCardFront: File | undefined
  idCardBack: File | undefined
  file?: File | undefined
}

export const defaultMediaForm = reactive<IMediaForm>({
  face1: undefined,
  face2: undefined,
  studentCardFront: undefined,
  studentCardBack: undefined,
  idCardFront: undefined,
  idCardBack: undefined,
  file: undefined,
})
