import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { IMovie, IMovieCreate } from '../../interface/movie.interface'
import { IMovieModel } from '../IMovieModel'

export class MovieModel implements IMovieModel {
  private readonly conn!: Connection

  constructor ({ conn }: { conn: Connection }) {
    this.conn = conn
  }

  async init (): Promise<void> {
    // this.conn // Estableces la conexión una sola vez
  }

  getAll = async ({ genre }: { genre: string }): Promise<IMovie[]> => {
    console.log('genre: ', genre)
    const [result] = await this.conn.query<RowDataPacket[]>(
    `SELECT BIN_TO_UUID(id) as _id, title, year, director, duration, poster, rate, estado, created_at, updated_at
    FROM movie;`
    )
    // mapear
    const movies: IMovie[] = result.map(row => ({
      id: row.id,
      title: row.title,
      year: row.year,
      director: row.director,
      duration: row.duration,
      poster: row.poster,
      rate: row.rate,
      estado: row.estado,
      created_at: row.created_at,
      updated_at: row.updated_at
    }))

    return movies
  }

  getById = async ({ id }: { id: string }): Promise<IMovie | null> => {
    const [result] = await this.conn.query<RowDataPacket[]>(
      `SELECT BIN_TO_UUID(id) as _id, title, year, director, duration, poster, rate, estado, created_at, updated_at
      FROM movie
      WHERE BIN_TO_UUID(id)=?;`,
      [id]
    )

    if (result.length > 0) {
      const result0 = result[0]
      const movie: IMovie = {
        id: result0.id,
        title: result0.title,
        year: result0.year,
        director: result0.director,
        duration: result0.duration,
        poster: result0.poster,
        rate: result0.rate,
        estado: result0.estado,
        created_at: result0.created_at,
        updated_at: result0.updated_at
      }
      return movie
    }
    return null
  }

  create = async ({ input }: { input: IMovieCreate }): Promise<IMovie | null> => {
    const {
      title,
      year,
      director,
      rate,
      duration,
      poster
    } = input
    const [uuidResult] = await this.conn.query<RowDataPacket[]>('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      const [result] = await this.conn.query<ResultSetHeader>(`
      INSERT INTO movie( id, title, year, director, rate, duration, poster) 
      VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)
      `,
      [uuid, title, year, director, rate, duration, poster]
      )
      console.log(result.affectedRows)
      const movie = await this.getById({ id: uuid })
      return movie
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
        await this.conn.query('DELETE FROM movie where BIN_TO_UUID(id) = ?', [id])
        return true
      } catch (error: any) {
        throw new Error('Error deleting movi')
        // console.log(error.message)
        // return false
      }
    } else {
      return false
    }
  }

  update = async ({ id, input }: { id: string, input: IMovieCreate }): Promise<any> => {
    const movie = await this.getById({ id })

    const inputUpdateMovie = { ...movie, ...input }
    const { title, year, director, duration, poster, rate } = inputUpdateMovie
    if (movie === undefined) {
      return false
    }

    try {
      await this.conn.query(`
        UPDATE movie
        SET
          title = ?,
          year = ?,
          director = ?,
          duration = ?,
          poster = ?,
          rate = ?
        WHERE
          BIN_TO_UUID(id)=?
        `, [title, year, director, duration, poster, rate, id])

      const m = await this.getById({ id })
      return m
    } catch (error: any) {
      console.log(error.message)
      // throw new Error('Error updating movie')
    }
  }
}
