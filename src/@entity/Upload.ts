import type { IActivityRecord } from './ActivityRecord'

export interface IUpload {
  id: number
  filePath: string

  /** Short-lived signed URL issued by the API for inline viewing. */
  fileUrl: string

  /** Short-lived signed URL issued by the API for downloading. */
  downloadUrl: string
  fileName: string
  fileSize: number
  fileType: string
  description: string
  uploadedAt: string
  activityRecord: IActivityRecord
}

export interface IUploadList extends IUpload {
}
