export interface IUser {
  id: string
  name: string
  username: string
  password: string
  estado: 1 | 0
}

export type IUserCreate = Omit<IUser, 'id'>
