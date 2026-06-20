const dbService = require('../services/db.service');
const { Resend } = require('resend');
const { EMAIL_USER } = require('../config/constants');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.send = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ success: false, message: 'All fields required' });

    // 1. Save to database
    const contact = await dbService.create('contacts', {
      name, email, subject, message,
      ip_address: req.ip,
    });

    // 2. Send email in background (DO NOT await)
    resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: EMAIL_USER,
      subject: `[Portfolio] New message: ${subject}`,
      html: `
        <h2>New contact from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    }).then(() => {
      console.log('✅ Email sent successfully!');
    }).catch((err) => {
      console.error('❌ Email failed:', err.message);
    });

    // 3. Respond immediately
    res.status(201).json({ success: true, message: 'Message sent successfully', data: contact });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const messages = await dbService.findAll('contacts', {
      sort: 'created_at',
      order: 'desc'
    });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const msg = await dbService.update('contacts', req.params.id, { is_read: true });
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await dbService.delete('contacts', req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};