import { type IUploadForm } from './Upload'

export interface IActivityRecordForm {
  id: number
  text: string
  uploads: IUploadForm[] | undefined
}
