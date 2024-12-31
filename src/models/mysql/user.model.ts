import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { IUserCreate } from '../../interface/user.interface'

export class UserModel {
  private readonly conn!: Connection

  constructor ({ conn }: { conn: Connection }) {
    this.conn = conn
  }

  getAll = async ({ username }: { username: string }): Promise<any> => {
    if (username !== undefined) {
      const lowerUsername = username.toLowerCase()

      const [userRows] = await this.conn.query<RowDataPacket[]>(
          `SELECT BIN_TO_UUID(id) as _id, name, username, password, estado, created_at, updated_at
          FROM users
          WHERE LOWER(username) like (%?%);`, [lowerUsername]
      )
      return userRows
    } else {
      const [result] = await this.conn.query(
      `SELECT BIN_TO_UUID(id) as _id, name, username, password, estado, created_at, updated_at
      FROM users;`
      )
      return result
    }
  }

  getById = async ({ id }: { id: string }): Promise<any> => {
    const [result] = await this.conn.query<RowDataPacket[]>(
      `SELECT BIN_TO_UUID(id) as _id, name, username, password, estado, created_at, updated_at
      FROM users
      WHERE BIN_TO_UUID(id)=?;`,
      [id]
    )
    return result[0]
  }

  create = async ({ input }: { input: any }): Promise<any> => {
    const {
      name,
      username,
      password
    } = input
    const [uuidResult] = await this.conn.query<RowDataPacket[]>('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await this.conn.query<ResultSetHeader>(`
      INSERT INTO users( id, name, username, password) 
      VALUES (UUID_TO_BIN(?), ?, ?, ?)
      `,
      [uuid, name, username, password]
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

  delete = async ({ id }: { id: string }): Promise<boolean> => {
    const movie = await this.getById({ id })

    if (movie !== undefined) {
      try {
        await this.conn.query('DELETE FROM users where BIN_TO_UUID(id) = ?', [id])
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

  update = async ({ id, input }: { id: string, input: IUserCreate }): Promise<any> => {
    const user = await this.getById({ id })
    console.log(input)

    const inputUpdateUser = { ...user, ...input }
    const { name, username, password } = inputUpdateUser
    if (user === undefined) {
      return false
    }

    try {
      const [result] = await this.conn.query<ResultSetHeader>(`
        UPDATE users
        SET
          name = ?,
          username = ?,
          password = ?
        WHERE
          BIN_TO_UUID(id)=?;
        `, [name, username, password, id])

      console.log(result.affectedRows)

      const m = await this.getById({ id })
      console.log(m)
      return m
    } catch (error: any) {
      console.log(error.message)
      throw new Error('Error updating user')
    }
  }
}
