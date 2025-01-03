import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import bcrypt from 'bcrypt'
import { IPublicUser, IUser, IUserCreate } from '../../interface/user.interface'
import { IUserModel } from '../IUserModel'

export class UserModel implements IUserModel {
  private readonly conn!: Connection

  constructor ({ conn }: { conn: Connection }) {
    this.conn = conn
  }

  getAll = async ({ username }: { username: string }): Promise<IUser[]> => {
    if (username !== undefined) {
      const lowerUsername = username.toLowerCase()
      const [userRows] = await this.conn.query<RowDataPacket[]>(
          `SELECT BIN_TO_UUID(id) as id, name, username, password, estado, created_at, updated_at
          FROM user
          WHERE LOWER(username) = ?;`, [lowerUsername]
      )
      const users: IUser[] = userRows.map(row => ({
        id: row.id,
        name: row.name,
        username: row.username,
        password: row.password,
        estado: row.estado,
        created_at: row.created_at,
        updated_at: row.updated_at
      }))
      return users
    } else {
      const [result] = await this.conn.query<RowDataPacket[]>(
      `SELECT BIN_TO_UUID(id) as id, name, username, password, estado, created_at, updated_at
      FROM user;`
      )
      const users: IUser[] = result.map(row => ({
        id: row.id,
        name: row.name,
        username: row.username,
        password: row.password,
        estado: row.estado,
        created_at: row.created_at,
        updated_at: row.updated_at
      }))
      return users
    }
  }

  getById = async ({ id }: { id: string }): Promise<IUser | null> => {
    const [result] = await this.conn.query<RowDataPacket[]>(
      `SELECT BIN_TO_UUID(id) as id, name, username, password, estado, created_at, updated_at
      FROM user
      WHERE BIN_TO_UUID(id)=?;`,
      [id]
    )

    if (result.length > 0) {
      const user: IUser = {
        id: result[0].id,
        name: result[0].name,
        username: result[0].username,
        password: result[0].password,
        estado: result[0].estado,
        created_at: result[0].created_at,
        updated_at: result[0].updated_at

      }
      return user
    }
    return null
  }

  create = async ({ input }: { input: IUserCreate }): Promise<IUser | null> => {
    const {
      name,
      username,
      password
    } = input
    const [uuidResult] = await this.conn.query<RowDataPacket[]>('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    const passwordHash = await bcrypt.hash(password, 10)

    try {
      await this.conn.query<ResultSetHeader>(`
      INSERT INTO user( id, name, username, password) 
      VALUES (UUID_TO_BIN(?), ?, ?, ?)
      `,
      [uuid, name, username, passwordHash]
      )

      const user = await this.getById({ id: uuid })
      return user
    } catch (error: any) {
      throw new Error('Error creaing movie')
      // enviar la traza a un servicio interno
      // console.log(error.message)
      // return false
    }
  }

  update = async ({ id, input }: { id: string, input: IUserCreate }): Promise<IUser | null> => {
    const user = await this.getById({ id })
    const inputUpdateUser = { ...user, ...input }
    const { name, username, password } = inputUpdateUser
    if (user === undefined) {
      return null
    }

    const passwordHash = await bcrypt.hash(password, 10)
    try {
      // const [result] = await this.conn.query<ResultSetHeader>(`
      await this.conn.query<ResultSetHeader>(`
        UPDATE user
        SET
          name = ?,
          username = ?,
          password = ?
        WHERE
          BIN_TO_UUID(id)=?;
        `, [name, username, passwordHash, id])

      // console.log(result.affectedRows)
      const user = await this.getById({ id })
      return user
    } catch (error: any) {
      console.log(error.message)
      throw new Error('Error updating user')
    }
  }

  delete = async ({ id }: { id: string }): Promise<boolean> => {
    const movie = await this.getById({ id })

    if (movie !== undefined) {
      try {
        await this.conn.query('DELETE FROM user where BIN_TO_UUID(id) = ?', [id])
        return true
      } catch (error: any) {
        throw new Error('Error deleting user')
        // console.log(error.message)
        // return false
      }
    } else {
      return false
    }
  }

  exists = async ({ id, username }: { id: string | undefined, username: string | undefined }): Promise<boolean> => {
    let query = 'SELECT BIN_TO_UUID(id) as id, name, username, password, estado, created_at, updated_at FROM user '
    let param: string = ''
    if (id !== undefined) {
      query += 'WHERE id = ?;'
      param = id
    } else if (username !== undefined) {
      query += 'WHERE username = ?;'
      param = username
    }
    const [result] = await this.conn.query<RowDataPacket[]>(query, [param])

    if (result.length > 0) {
      return true
    }

    return false
  }

  login = async ({ username, password }: { username: string, password: string }): Promise<IPublicUser | undefined> => {
    const query = 'SELECT BIN_TO_UUID(id) as id, name, username, password FROM user WHERE estado=TRUE and username=?;'
    const [result] = await this.conn.query<RowDataPacket[]>(query, [username])
    if (result.length > 0) {
      const userDB = { ...result[0] }
      const isLogin = await bcrypt.compare(password, userDB.password)
      if (isLogin) {
        const { password: _, ...publicUser } = userDB
        return publicUser as IPublicUser
      } else {
        return undefined
      }
    }
    return undefined
  }
}
