import movies from '../../movies.json'
import { randomUUID } from 'node:crypto'

export class MovieModel {
  getAll = async ({ genre }: { genre: string }): Promise<any> => {
    if (genre !== undefined) {
      const filterMovies = movies.filter(
        movie => movie.genre?.some(g => g.toLowerCase() === genre.toLowerCase())
      )
      return filterMovies
    } else {
      return movies
    }
  }

  getById = async ({ id }: { id: string }): Promise<any> => {
    return movies.find(movie => movie.id === id)
  }

  create = async ({ input }: { input: any }): Promise<any> => {
    const newMovie = {
      id: randomUUID(),
      ...input
    }

    movies.push(newMovie)
    return newMovie
  }

  delete = async ({ id }: { id: string }): Promise<boolean> => {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
      return false
    } else {
      movies.splice(movieIndex, 1)
      return true
    }
  }

  update = async ({ id, input }: any): Promise<any> => {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
      return undefined
    } else {
      const updateMovie = {
        ...movies[movieIndex],
        ...input
      }

      movies[movieIndex] = {
        id: updateMovie.id,
        title: updateMovie.title ?? 'untitled',
        year: updateMovie.year ?? 1900,
        director: updateMovie.director ?? 'Undirector',
        duration: updateMovie.duration ?? 0,
        poster: updateMovie.poster ?? 'unposter',
        genre: updateMovie.genre ?? [],
        rate: updateMovie.rate ?? 5.5
      }
      return movies[movieIndex]
    }
  }
}
