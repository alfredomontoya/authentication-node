export interface IMovie {
  id: string
  title: string
  year: number
  director: string
  duration: number
  poster: string
  rate: number
}

export type IMovieCreate = Omit<IMovie, 'id'>
