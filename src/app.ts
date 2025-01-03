import express from 'express'
import { createMovieRouter } from './routes/movie.route'
import { corsMiddleware } from './middlewares/cors'
import { createUserRouter } from './routes/user.route'
import { config } from '../config'

export const createApp = (models: any): void => {
  const app = express()
  app.set('view engine', 'ejs')
  app.use(express.json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  const { movieModel, userModel } = models
  // Rutas
  app.get('/', (_req, res) => {
    res.render('auth/login', { name: 'alfredo montoya' })
  })

  app.get('/protected', (_req, res) => {
    res.render('protected', { name: 'alfredo montoya' })
  })
  app.get('/register', (_req, res) => {
    res.render('auth/register')
  })

  if (movieModel !== undefined) app.use('/movies', createMovieRouter({ movieModel }))
  if (userModel !== undefined) app.use('/users', createUserRouter({ userModel }))

  const PORT = config.port

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
  })
}
