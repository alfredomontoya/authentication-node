import { IUserModel } from '../models/IUserModel'

// Función para validar si el username es único
export class validationMiddleware {
  private readonly userModel

  constructor ({ userModel }: { userModel: IUserModel }) {
    this.userModel = userModel
  }

  async usernameIsUnique (username: string): Promise<void> {
    await this.userModel.exists({ username })
    throw new Error('Username already exists')
  }
}
