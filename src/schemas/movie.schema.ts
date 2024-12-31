import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().positive().min(1900).max(2024),
  director: z.string(),
  rate: z.number().min(0).max(10).default(5.5),
  duration: z.number(),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre i required',
      invalid_type_error: 'Movie genre must be an array of enum genre'
    }
  ),
  poster: z.string().url({
    message: 'Poster must ve a valid URL'
  })

})

export const validateMovie = (object: any): any => {
  return movieSchema.safeParse(object)
}

export const validatePartialMovie = (input: any): any => {
  return movieSchema.partial().safeParse(input)
}
