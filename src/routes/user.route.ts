import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { IUserModel } from '../models/IUserModel'
// import { MovieModel } from '../models/mysql/movie.model'

export const createUserRouter = ({ userModel }: { userModel: IUserModel }): Router => {
  const userRouter = Router()

  const userController = new UserController({ userModel })
  // Listar movies
  userRouter.get('/', userController.getAll)

  // Obtener movie por id
  userRouter.get('/:id', userController.getById)

  // Crear movie
  userRouter.post('/', userController.create)

  // Modificar movie
  userRouter.patch('/:id', userController.update)

  // Eliminar movie
  userRouter.delete('/:id', userController.delete)

  return userRouter
}
