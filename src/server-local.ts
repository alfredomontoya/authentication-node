import { createApp } from './app'

import { MovieModel } from './models/local-file-system/movie.model'

const movieModel = new MovieModel()

createApp({ movieModel })
