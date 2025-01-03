import { Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import { IUserModel } from '../models/IUserModel'
import { ValidationUser } from '../schemas/user.schema'
import { IPublicUser } from '../interface/user.interface'

export class UserController {
  private readonly userModel
  private readonly validationUser: ValidationUser

  constructor ({ userModel }: { userModel: IUserModel }) {
    this.userModel = userModel
    this.validationUser = new ValidationUser(this.userModel)
  }

  getAll = async (req: Request, res: Response): Promise<any> => {
    const { username } = req.query as { username: string }
    const users = await this.userModel.getAll({ username })
    res.json(users)
  }

  getById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params
    const user = await this.userModel.getById({ id })

    if (user != null) {
      res.json(user)
    } else {
      res.status(404).json({ message: 'user not found' })
    }
  }

  create = async (req: Request, res: Response): Promise<void> => {
    console.log(req.body)
    const result = await this.validationUser.validateUser(req.body)

    if (result.success === true) {
      if (result.data !== undefined) {
        const newuser = await this.userModel.create({ input: result.data })
        res.status(201).json(newuser)
      }
    } else {
      if (result.error != null) { res.status(400).json({ error: JSON.parse(result.error.message) }) }
    }
  }

  update = async (req: Request, res: Response): Promise<any> => {
    const result = await this.validationUser.validatePartialUser(req.body)

    if (result.success === false) {
      res.status(404).json({ error: JSON.parse(result.error.message) })
    } else {
      const { id } = req.params
      const updateduser = await this.userModel.update({ id, input: result.data })
      res.json(updateduser)
    }
  }

  delete = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params

    const result = await this.userModel.delete({ id })
    if (!result) {
      res.status(400).json({ error: 'user not fount' })
    } else {
      res.json({ message: 'user deleted' })
    }
  }

  login = async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body
    const userLogin: IPublicUser | undefined = await this.userModel.login({ username, password })
    if (userLogin === undefined) {
      res.status(400).json({ error: 'usuario o contraseña incorrectos!' })
    } else {
      const token = jwt.sign({ userLogin }, 'this-is-my-awedome-secret-key')
      console.log(token)
      res.json({ user: userLogin })
    }
  }
}
