import express from 'express'
import { createMovieRouter } from './routes/movie.route'
import { corsMiddleware } from './middlewares/cors'
import { createUserRouter } from './routes/user.route'

export const createApp = ({ movieModel, userModel }: { movieModel: any, userModel: any }): void => {
  const app = express()
  app.use(express.json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  // Rutas
  app.use('/movies', createMovieRouter({ movieModel }))
  app.use('/users', createUserRouter({ userModel }))

  const PORT = process.env.PORT ?? 3000

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
  })
}
