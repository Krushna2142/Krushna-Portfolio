const dbService = require('../services/db.service');
const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = require('../config/constants');

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  pool: true, // <--- ADD THIS: Reuses connections, making subsequent emails instant
  maxConnections: 5,
  maxMessages: 100,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

exports.send = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ success: false, message: 'All fields required' });

    // 1. Save to database (Keep await here so you have the data)
    const contact = await dbService.create('contacts', {
      name, email, subject, message,
      ip_address: req.ip,
    });

    // 2. SEND EMAIL IN THE BACKGROUND (DO NOT USE 'await')
    transporter.sendMail({
      from: EMAIL_USER,
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
      console.error('❌ Email sending failed:', err.message);
      console.error('Error code:', err.code);
      console.error('Error response:', err.response);
    });

    // 3. RESPOND TO FRONTEND IMMEDIATELY (Takes < 50ms)
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