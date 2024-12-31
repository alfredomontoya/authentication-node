import { Timestamp } from 'mongodb'

export interface IMovie {
  id: string
  title: string
  year: number
  director: string
  duration: number
  poster: string
  rate: number
  estado: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export type IMovieCreate = Omit<IMovie, 'id'>
