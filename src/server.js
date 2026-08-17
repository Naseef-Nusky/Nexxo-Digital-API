const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { config } = require('./config')
const quoteRouter = require('./routes/quote')

const app = express()

app.use(helmet())
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no Origin) and configured frontends
      if (!origin || config.corsOrigins.includes(origin)) {
        return callback(null, true)
      }
      // In development, allow any localhost / 127.0.0.1 Vite port
      if (
        config.nodeEnv !== 'production' &&
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true)
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
  })
)
app.use(express.json({ limit: '100kb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'nexxo-digital-api' })
})

app.use('/api/quote', quoteRouter)

app.use((err, _req, res, _next) => {
  if (err?.message?.includes('not allowed by CORS')) {
    return res.status(403).json({ ok: false, error: 'CORS blocked.' })
  }
  console.error(err)
  return res.status(500).json({ ok: false, error: 'Unexpected server error.' })
})

app.listen(config.port, () => {
  console.log(`Nexxo Digital API listening on http://localhost:${config.port}`)
})
