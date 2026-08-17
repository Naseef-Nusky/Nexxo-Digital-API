const express = require('express')
const rateLimit = require('express-rate-limit')
const { sendQuoteEmails } = require('../services/mail')

const router = express.Router()

const quoteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests. Please try again later.' },
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clean(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateQuote(body = {}) {
  const payload = {
    name: clean(body.name),
    business: clean(body.business),
    email: clean(body.email),
    telephone: clean(body.telephone),
    need: clean(body.need),
    project: clean(body.project),
    source: clean(body.source) || 'website',
  }

  const errors = []

  if (!payload.name || payload.name.length < 2) {
    errors.push('Name is required.')
  }
  if (!payload.email || !EMAIL_RE.test(payload.email)) {
    errors.push('A valid email is required.')
  }
  if (!payload.need) {
    errors.push('Please select what you need.')
  }
  if (payload.project.length > 5000) {
    errors.push('Project details are too long.')
  }

  return { payload, errors }
}

router.post('/', quoteLimiter, async (req, res) => {
  const { payload, errors } = validateQuote(req.body)

  if (errors.length) {
    return res.status(400).json({ ok: false, errors })
  }

  try {
    await sendQuoteEmails(payload)
    return res.status(200).json({ ok: true, message: 'Quote request sent.' })
  } catch (error) {
    console.error('[quote] SendGrid error:', error?.response?.body || error)
    return res.status(502).json({
      ok: false,
      error: 'Unable to send your request right now. Please try again shortly.',
    })
  }
})

module.exports = router
