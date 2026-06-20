const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.send = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    // Send email in background (DO NOT await)
    resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.EMAIL_USER, // Your email where you want to receive messages
      replyTo: email, // So you can reply directly to the client
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
    }).then(() => {
      console.log('✅ Email sent successfully via Resend!');
    }).catch((err) => {
      console.error('❌ Email failed:', err.message);
    });

    // Respond immediately
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully' 
    });

  } catch (err) {
    console.error('❌ Controller error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => res.json({ success: true, data: [] });
exports.markRead = async (req, res) => res.json({ success: true });
exports.remove = async (req, res) => res.json({ success: true });