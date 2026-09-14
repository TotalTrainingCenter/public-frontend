import type { IAccount } from './Account'
import type { IBoard } from './Board'

export interface IBoardAttribute {
  id: number
  board: IBoard
  key: string
  value: string
  account: IAccount
  createdAt?: string
  updatedAt?: string
}
