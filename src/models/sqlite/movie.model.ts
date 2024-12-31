import mysql, { RowDataPacket } from 'mysql2/promise'
import { openDb } from './configDB'

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'movies-database'
}

const connection = async (): Promise<mysql.Connection> => {
  const conn = await mysql.createConnection(config)
  return conn
}

export class MovieModel {
  private readonly conn: any
  createModel = async (): Promise<void> => {
    await openDb().then(db => {
      db.exec(`CREATE TABLE IF NOT EXISTS movie (
        id BLOB NOT NULL DEFAULT (lower(hex(randomblob(16)))),
        title TEXT NOT NULL,
        year INTEGER NOT NULL,
        director TEXT NOT NULL,
        duration INTEGER NOT NULL,
        poster TEXT,
        rate REAL NOT NULL CHECK (rate >= 0 AND rate <= 99.9),
        PRIMARY KEY (id)
        );`)
    })
  }

  getAll = async ({ genre }: { genre: string }): Promise<any> => {
    const conn = await connection()
    if (genre !== undefined) {
      const lowerGenre = genre.toLowerCase()
      const [rows] = await conn.query<RowDataPacket[]>('SELECT id FROM genre WHERE LOWER(genre.name)=?;', [lowerGenre])
      if (rows.length > 0) {
        const [movieGenreRows] = await conn.query<RowDataPacket[]>('SELECT BIN_TO_UUID(mg.movie_id) as movie_id FROM movie_genres as mg WHERE mg.genre_id=?;', [rows[0].id])
        const movieIds = movieGenreRows.map(row => row.movie_id)
        const [movieRows] = await conn.query<RowDataPacket[]>(
          `SELECT BIN_TO_UUID(id) as _id, title, year, director, duration,poster, rate
          FROM movie
          WHERE BIN_TO_UUID(id) IN (?);`, [movieIds]
        )
        return movieRows
      }
    } else {
      const result = await openDb().then(db => {
        return db.all('SELECT * FROM movie')
      })
      return result
    }
  }

  getById = async ({ id }: { id: string }): Promise<any> => {
    const conn = await connection()
    const [result] = await conn.query<RowDataPacket[]>(
      `SELECT BIN_TO_UUID(id) as _id, title, year, director, duration, poster, rate
      FROM movie
      WHERE BIN_TO_UUID(id)=?;`,
      [id]
    )
    return result
  }

  create = async ({ input }): Promise<any> => {

  }

  // delete = async ({ id }): Promise<any> => {

  // }

  // updated = async ({ id, input }): Promise<any> => {

  // }
}
