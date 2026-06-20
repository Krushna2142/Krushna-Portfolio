const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = require('../config/constants');

// Create transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST || 'smtp.gmail.com',
  port: EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  family: 4, // <--- 🪄 THIS IS THE MAGIC FIX! Forces IPv4
  tls: {
    rejectUnauthorized: false,
  },
});

// 🔥 CRITICAL: This runs when the server starts. 
// It will instantly tell us if your Render env variables are correct.
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ EMAIL SERVER CONNECTION FAILED!');
    console.error('Reason:', error.message);
    console.error('Check your EMAIL_USER and EMAIL_PASS in Render Environment Variables.');
  } else {
    console.log('✅ Email server is ready and waiting for messages...');
  }
});

exports.send = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    // Email configuration
    const mailOptions = {
      from: `"Portfolio Contact" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: email, // When you hit "reply" in Gmail, it replies to the client
      subject: `[Portfolio] New message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #333;">New contact from ${name}</h2>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #eee;"/>
          <p style="line-height: 1.6;"><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
        </div>
      `,
    };

    // Send email in the background (DO NOT await - keeps frontend lightning fast)
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ EMAIL FAILED TO SEND!');
        console.error('Error Message:', error.message);
        console.error('Error Code:', error.code);
      } else {
        console.log('✅ Email sent successfully! ID:', info.messageId);
      }
    });

    // Respond to frontend immediately
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully' 
    });

  } catch (err) {
    console.error('❌ Controller error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// You can remove or keep these, they won't be used by the form anymore
exports.getAll = async (req, res) => res.json({ success: true, data: [] });
exports.markRead = async (req, res) => res.json({ success: true });
exports.remove = async (req, res) => res.json({ success: true });