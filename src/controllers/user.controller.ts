import { Response, Request } from 'express'

import { validatePartialUser, validateUser } from '../schemas/user.schema'
import { IUserModel } from '../models/IUserModel'

export class UserController {
  private readonly userModel

  constructor ({ userModel }: { userModel: IUserModel }) {
    this.userModel = userModel
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
    const result = validateUser(req.body)

    if (result.success === false) {
      res.status(400).json({ error: JSON.parse(result.error.message) })
    } else {
      const newuser = await this.userModel.create({ input: result.data })
      res.status(201).json(newuser)
    }
  }

  update = async (req: Request, res: Response): Promise<any> => {
    const result = validatePartialUser(req.body)

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
}
