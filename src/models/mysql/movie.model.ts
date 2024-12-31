import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { IMovieCreate } from '../../interface/movie.interface'

export class MovieModel {
  private readonly conn!: Connection

  constructor ({ conn }: { conn: Connection }) {
    this.conn = conn
  }

  async init (): Promise<void> {
    // this.conn // Estableces la conexión una sola vez
  }

  getAll = async ({ genre }: { genre: string }): Promise<any> => {
    if (genre !== undefined) {
      const lowerGenre = genre.toLowerCase()
      const [rows] = await this.conn.query<RowDataPacket[]>('SELECT id FROM genre WHERE LOWER(genre.name)=?;', [lowerGenre])
      if (rows.length > 0) {
        const [movieGenreRows] = await this.conn.query<RowDataPacket[]>(`
          SELECT BIN_TO_UUID(mg.movie_id) as movie_id 
          FROM movie_genres as mg 
          WHERE mg.genre_id=?;`
        , [rows[0].id]
        )
        const movieIds = movieGenreRows.map(row => row.movie_id)
        const [movieRows] = await this.conn.query<RowDataPacket[]>(
          `SELECT BIN_TO_UUID(id) as _id, title, year, director, duration,poster, rate
          FROM movie
          WHERE BIN_TO_UUID(id) IN (?);`, [movieIds]
        )
        return movieRows
      }
    } else {
      const [result] = await this.conn.query(
      `SELECT BIN_TO_UUID(id) as _id, title, director, duration,poster, rate
      FROM movie;`
      )
      return result
    }
  }

  getById = async ({ id }: { id: string }): Promise<any> => {
    const [result] = await this.conn.query<RowDataPacket[]>(
      `SELECT BIN_TO_UUID(id) as _id, title, year, director, duration, poster, rate
      FROM movie
      WHERE BIN_TO_UUID(id)=?;`,
      [id]
    )
    return result[0]
  }

  create = async ({ input }: { input: any }): Promise<any> => {
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
