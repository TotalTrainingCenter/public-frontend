import type { IAccount } from './Account'
import type { IBoardAttribute } from './BoardAttribute'
import type { ICategory } from './Category'
import type { IUpload } from './Upload'

export interface IBoard {
  id: number
  category: ICategory
  attributes: IBoardAttribute[]
  files?: IUpload[]
  thumbnails?: IUpload[]
  account: IAccount
  createdAt?: string
  updatedAt?: string
}

export interface IBoardList extends IBoard {
  categoryKey: string
  categoryName: string
  subject: string
  content: { original: string; short: string }
  accountId: number
  accountUsername: number
}
