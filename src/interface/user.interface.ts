import { Timestamp } from 'mongodb'

export interface IUser {
  id: string
  name: string
  username: string
  password: string
  created_at: Timestamp
  updated_at: Timestamp
  estado: 1 | 0
}

export type IUserCreate = Omit<IUser, 'id'>
