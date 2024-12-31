import { IUser, IUserCreate } from '../interface/user.interface'

export interface IUserModel {
  getAll: ({ username }: { username: string }) => Promise<IUser[]>
  getById: ({ id }: { id: string }) => Promise<IUser | null>
  create: ({ input }: { input: IUserCreate }) => Promise<IUser | null>
  update: ({ id, input }: { id: string, input: IUserCreate }) => Promise<IUser | null>
  delete: ({ id }: { id: string }) => Promise<boolean>
}
