import { Response, Request } from 'express'

import { validateMovie, validatePartialMovie } from '../schemas/movie.schema'

export class MovieController {
  private readonly movieModel

  constructor (movieModel: any) {
    this.movieModel = movieModel
  }

  getAll = async (req: Request, res: Response): Promise<any> => {
    const { genre } = req.query as { genre: string }
    const movies = await this.movieModel.getAll({ genre })
    res.json(movies)
  }

  getById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params
    const movie = await this.movieModel.getById({ id })

    if (movie != null) {
      res.json(movie)
    } else {
      res.status(404).json({ message: 'Movie not found' })
    }
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const result = validateMovie(req.body)

    if (result.success === false) {
      res.status(400).json({ error: JSON.parse(result.error.message) })
    } else {
      const newMovie = await this.movieModel.create({ input: result.data })
      res.status(201).json(newMovie)
    }
  }

  update = async (req: Request, res: Response): Promise<any> => {
    const result = validatePartialMovie(req.body)

    if (result.success === false) {
      res.status(404).json({ error: JSON.parse(result.error.message) })
    } else {
      const { id } = req.params
      const updatedMovie = await this.movieModel.update({ id, input: result.data })
      res.json(updatedMovie)
    }
  }

  delete = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params

    const result = await this.movieModel.delete({ id })
    if (result !== undefined) {
      res.status(400).json({ error: 'Movie not fount' })
    } else {
      res.json({ message: 'Movie deleted' })
    }
  }
}
