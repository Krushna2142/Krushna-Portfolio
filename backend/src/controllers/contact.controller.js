const dbService = require('../services/db.service');
const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = require('../config/constants');

// Create transporter with better config
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST || 'smtp.gmail.com',
  port: EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Fix for self-signed certs
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email server connection failed:', error.message);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

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

    // 2. Email configuration
    const mailOptions = {
      from: `"Portfolio Contact" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: `[Portfolio] New message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New contact from ${name}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong><br/>${message}</p>
          <hr/>
          <p style="color: #888; font-size: 12px;">Sent from your portfolio website</p>
        </div>
      `,
    };

    // 3. Send email in background (DON'T await)
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Email sending failed:', error.message);
        console.error('Error code:', error.code);
        console.error('Error response:', error.response);
        console.error('Full error:', error);
      } else {
        console.log('✅ Email sent successfully:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }
    });

    // 4. Respond immediately to frontend
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully', 
      data: contact 
    });

  } catch (err) {
    console.error('❌ Controller error:', err);
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