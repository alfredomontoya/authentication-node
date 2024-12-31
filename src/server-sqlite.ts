import { createApp } from './app'

import { MovieModel } from './models/sqlite/movie.model'

const movieModel = new MovieModel()
const createModels = async (): Promise<void> => {
  await movieModel.create()
}

void createModels()

createApp({ movieModel })
