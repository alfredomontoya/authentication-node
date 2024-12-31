import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://locslhost:3000',
  'https://movies.com'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}): any => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin ?? '')) {
      return callback(null, true)
    }

    if (origin === undefined) { return callback(null, true) }

    return callback(new Error('Not allowed by CORS'))
  }

})
