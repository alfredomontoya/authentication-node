import z from 'zod'

const userSchema = z.object({
  name: z
    .string().min(3).max(32),
  username: z
    .string({
      invalid_type_error: 'el campo username debe ser strring',
      required_error: 'El campo username es requerido'
    })
    .min(5, {
      message: 'El campo username debe tener como minimo 5 caracteres'
    })
    .max(32, {
      message: 'El campo username debe tener como maximo 32 caracteres'
    }),
  password: z
    .string().min(8).max(32),
  estado: z
    .number()
    .int({ message: 'El estado debe ser un número entero' })
    .refine((value) => value === 1 || value === 0, { message: 'El estado solo puede ser 1 o 0' })
    .default(1)
})

export const validateUser = (object: any): any => {
  return userSchema.safeParse(object)
}

export const validatePartialUser = (object: any): any => {
  return userSchema.partial().safeParse(object)
}
