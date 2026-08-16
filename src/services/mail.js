const sgMail = require('@sendgrid/mail')
const { config, assertReadyForSend } = require('../config')

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildInternalEmail(payload) {
  const rows = [
    ['Name', payload.name],
    ['Business', payload.business || '—'],
    ['Email', payload.email],
    ['Telephone', payload.telephone || '—'],
    ['What they need', payload.need],
    ['Project details', payload.project],
    ['Source', payload.source || 'website'],
  ]

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n')

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0b1220">
      <h2 style="margin:0 0 16px">New quote request</h2>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:700;width:160px;vertical-align:top">${escapeHtml(label)}</td>
            <td style="padding:8px 12px;border:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(value)}</td>
          </tr>`
          )
          .join('')}
      </table>
    </div>
  `

  return {
    to: config.sendgrid.toEmail,
    from: {
      email: config.sendgrid.fromEmail,
      name: config.sendgrid.fromName,
    },
    replyTo: {
      email: payload.email,
      name: payload.name,
    },
    subject: `New quote request from ${payload.name}`,
    text,
    html,
  }
}

function buildAutoReply(payload) {
  const text = `Hi ${payload.name},

Thanks for getting in touch with Nexxo Digital. We’ve received your quote request and will reply shortly.

BUILD. RANK. GROW.

— Nexxo Digital
${config.sendgrid.fromEmail}`

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0b1220">
      <p>Hi ${escapeHtml(payload.name)},</p>
      <p>Thanks for getting in touch with <strong>Nexxo Digital</strong>. We’ve received your quote request and will reply shortly.</p>
      <p style="font-weight:700;letter-spacing:0.08em">BUILD. RANK. GROW.</p>
      <p>— Nexxo Digital<br/>${escapeHtml(config.sendgrid.fromEmail)}</p>
    </div>
  `

  return {
    to: payload.email,
    from: {
      email: config.sendgrid.fromEmail,
      name: config.sendgrid.fromName,
    },
    subject: 'We’ve received your Nexxo Digital quote request',
    text,
    html,
  }
}

async function sendQuoteEmails(payload) {
  assertReadyForSend()
  sgMail.setApiKey(config.sendgrid.apiKey)

  const messages = [buildInternalEmail(payload)]
  if (config.sendgrid.sendAutoReply) {
    messages.push(buildAutoReply(payload))
  }

  await sgMail.send(messages)
}

module.exports = { sendQuoteEmails }
