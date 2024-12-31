import { Router } from 'express'
import { MovieController } from '../controllers/movie.controller'
import { IMovieModel } from '../models/IMovieModel'

export const createMovieRouter = ({ movieModel }: { movieModel: IMovieModel }): Router => {
  const movieRouter = Router()

  const movieController = new MovieController(movieModel)

  // Listar movies
  movieRouter.get('/', movieController.getAll)

  // Obtener movie por id
  movieRouter.get('/:id', movieController.getById)

  // Crear movie
  movieRouter.post('/', movieController.create)

  // Modificar movie
  movieRouter.patch('/:id', movieController.update)

  // Eliminar movie
  movieRouter.delete('/:id', movieController.delete)

  return movieRouter
}
