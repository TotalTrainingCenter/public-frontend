import type { IAccount } from './Account'
import type { IActivity } from './Activity'
import type { IUpload } from './Upload'

export interface IActivityRecord {
  id: number
  account: IAccount
  activity: IActivity
  recordDate: string
  text: string
  completed: boolean
  uploads: IUpload[]
}

export interface IActivityRecordList extends IActivityRecord {
  activityGroupTitle: string
  activityTitle: string
  activityRequired: boolean
  activityDescription: string
  uploadSize: number
}

export interface IActivityRecordHistoryList extends IActivityRecord {
  groupActivityTitle: string
  activityTitle: string
  accountId: number
  accountUsername: string
  realName: number
  uploadSize: number
}
