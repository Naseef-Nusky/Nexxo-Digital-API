require('dotenv').config()

function required(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

const config = {
  port: Number(process.env.PORT || 5050),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'hello@nexxodigital.com',
    fromName: process.env.SENDGRID_FROM_NAME || 'Nexxo Digital',
    toEmail: process.env.SENDGRID_TO_EMAIL || 'hello@nexxodigital.com',
    sendAutoReply: String(process.env.SEND_AUTO_REPLY || 'true') === 'true',
  },
}

function assertReadyForSend() {
  required('SENDGRID_API_KEY')
  required('SENDGRID_FROM_EMAIL')
  required('SENDGRID_TO_EMAIL')
}

module.exports = { config, assertReadyForSend }
