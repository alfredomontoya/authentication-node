import mysql from 'mysql2/promise'
import { createApp } from './app'

import { MovieModel } from './models/mysql/movie.model'
import { UserModel } from './models/mysql/user.model'

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'movies-database'
}

const main = async (): Promise<void> => {
  const conn = await mysql.createConnection(config)

  const movieModel = new MovieModel({ conn })
  const userModel = new UserModel({ conn })

  const models = {
    movieModel,
    userModel
  }

  createApp(models)
}

main().catch(err => {
  console.error('Error during app initialization:', err)
})
