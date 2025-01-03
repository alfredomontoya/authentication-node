import { Timestamp } from 'mongodb'

export interface IUser {
  id: string
  name: string
  username: string
  password: string
  created_at: Timestamp
  updated_at: Timestamp
  estado: boolean
}

export type IUserCreate = Omit<IUser, 'id' | 'created_at' | 'updated_at' | 'estado'>
export type IPublicUser = Omit<IUser, 'password' | 'created_at' | 'updated_at' | 'estado'>
