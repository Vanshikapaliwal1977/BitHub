import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import twilio from 'twilio'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || ['http://localhost:5173'],      
}))
app.use(express.json())

async function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return { transporter: nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    }), isTest: false }
  }
  
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return { transporter: nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    }), isTest: false }
  }

  const testAccount = await nodemailer.createTestAccount()
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  })
  console.log('Using Ethereal test SMTP account. Messages will not be delivered to real inboxes.')
  return { transporter, isTest: true }
}

app.post('/api/mail/register', async (req, res) => {
  try {
    const { email, username } = req.body || {}
    if (!email) return res.status(400).json({ error: 'email is required' })

    const { transporter, isTest } = await createTransporter()

    const from = process.env.MAIL_FROM || process.env.SMTP_USER || process.env.GMAIL_USER
    const subject = process.env.MAIL_SUBJECT || 'Welcome to the Portfolio App'
    const html = `
      <div style="font-family:Arial,sans-serif;">
        <h2>Welcome${username ? `, ${username}` : ''}!</h2>
        <p>Thanks for registering with us. We're excited to have you on board.</p>
      </div>
    `

    const info = await transporter.sendMail({
      from,
      to: email,
      subject,
      html,
    })

    if (isTest) {
      const preview = nodemailer.getTestMessageUrl(info)
      console.log('Preview URL:', preview)
      res.json({ ok: true, preview })
      return
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('Email send failed:', err)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

app.post('/api/mail/contact', async (req, res) => {
  try {
    const { name, email, subject, phone, message } = req.body || {}
    if (!name || !email || !message) return res.status(400).json({ error: 'name, email, and message are required' })

    const { transporter, isTest } = await createTransporter()
    const to = process.env.MAIL_TO || process.env.MAIL_FROM || process.env.SMTP_USER || process.env.GMAIL_USER
    const from = process.env.MAIL_FROM || process.env.SMTP_USER || process.env.GMAIL_USER
    const subj = subject && subject.trim() ? subject : 'New Connect Message'
    const html = `
      <div style="font-family:Arial,sans-serif;">
        <h2>New Connect Message</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Subject:</strong> ${subj}</p>
        <p><strong>Message:</strong></p>
        <p>${(message || '').replace(/\n/g,'<br/>')}</p>
      </div>
    `

    const info = await transporter.sendMail({
      from,
      to,
      subject: subj,
      replyTo: email,
      html,
    })

    // Send confirmation email to the sender
    const confirmationHtml = `
      <div style="font-family:Arial,sans-serif;">
        <h2>Thank you for your message!</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you soon.</p>
        <p><strong>Your message:</strong></p>
        <p>${(message || '').replace(/\n/g,'<br/>')}</p>
        <p>Best regards,<br/>Vanshika Paliwal</p>
      </div>
    `

    await transporter.sendMail({
      from,
      to: email, // Send to the entered email (sender's email)
      subject: 'Thank you for contacting us',
      html: confirmationHtml,
    })

    if (isTest) {
      const preview = nodemailer.getTestMessageUrl(info)
      console.log('Preview URL:', preview)
      res.json({ ok: true, preview })
      return
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('Contact email failed:', err)
    res.status(500).json({ error: 'Failed to send contact email' })
  }
})

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/', (_req, res) => {
  res.type('text').send('Server is running.')
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
