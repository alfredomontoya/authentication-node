import dotenv from 'dotenv'

// Carga las variables de entorno
dotenv.config()

// Valida que las variables necesarias estén definidas
if (process.env.PORT === undefined || process.env.SECRET_KEY === undefined) {
  throw new Error('Missing required environment variables!!!')
}

// Exporta las variables para usarlas en el proyecto
export const config = {
  port: parseInt(process.env.PORT ?? 8000),
  secretKey: process.env.SECRET_KEY
}

export const configDb = {
  host: 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3000'),
  user: process.env.DB_USER ?? 'user_db',
  password: process.env.DB_PASSWORD ?? 'password_db',
  database: process.env.DB_NAME ?? 'db_name'
}
