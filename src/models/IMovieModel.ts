import { IMovie, IMovieCreate } from '../interface/movie.interface'

export interface IMovieModel {
  getAll: ({ genre }: { genre: string }) => Promise<IMovie[]>
  getById: ({ id }: { id: string }) => Promise<IMovie | null>
  create: ({ input }: { input: IMovieCreate }) => Promise<IMovie | null>
  update: ({ id, input }: { id: string, input: IMovieCreate }) => Promise<IMovie | null>
  delete: ({ id }: { id: string }) => Promise<boolean>
}
