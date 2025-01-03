import z from 'zod'
import { IUserCreate } from '../interface/user.interface'
import { IUserModel } from '../models/IUserModel'
export class ValidationUser {
  userSchema = z.object({
    name: z
      .string().min(3).max(32),
    username: z
      .string({
        invalid_type_error: 'el campo username debe ser strring',
        required_error: 'El campo username es requerido'
      })
      .min(5, {
        message: 'El campo username debe tener como minimo 5 caracteres'
      })
      .max(32, {
        message: 'El campo username debe tener como maximo 32 caracteres'
      })
      .refine(async (username: string) => {
      // Aquí verificamos si el usuario ya existe en la base de datos
        const existe = await this.userModel.exists({ id: undefined, username })
        return !existe
      }, {
        message: 'El usuario ya existe'
      }),
    password: z
      .string().min(8, { message: ' El campo password debe tener al menos 8 caracteres' }).max(32)
    // estado: z
    //   .boolean({ message: 'El estado debe ser true or false' })
    //   .default(true)
  })

  private readonly userModel

  constructor (userModel: IUserModel) {
    this.userModel = userModel
  }

  validateUser = async (object: IUserCreate): Promise<any> => {
    return await this.userSchema.safeParseAsync(object)
  }

  validatePartialUser = async (object: any): Promise<any> => {
    return await this.userSchema.partial().safeParseAsync(object)
  }
}
