const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const dbService = require('../services/db.service');
const supabase = require('../config/supabase');
const nodemailer = require('nodemailer');
const { JWT_SECRET, JWT_EXPIRES_IN, EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT, REGISTRATION_SECRET } = require('../config/constants');

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const admins = await dbService.findAll('admins', { filter: { email } });
    const admin = admins[0];
    
    if (!admin || !(await bcrypt.compare(password, admin.password_hash)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    await dbService.update('admins', admin.id, {
      last_login: new Date().toISOString(),
      login_count: admin.login_count + 1
    });

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: { 
        token, 
        email: admin.email, 
        lastLogin: admin.last_login 
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// REGISTER (requires secret code)
exports.register = async (req, res) => {
  try {
    const { email, password, registrationSecret } = req.body;
    
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });
    
    if (password.length < 8)
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    
    // Verify registration secret
    if (registrationSecret !== REGISTRATION_SECRET)
      return res.status(403).json({ success: false, message: 'Invalid registration secret' });

    // Check if admin exists
    const existing = await dbService.findAll('admins', { filter: { email } });
    if (existing.length > 0)
      return res.status(400).json({ success: false, message: 'Admin already exists' });

    const password_hash = await bcrypt.hash(password, 12);
    
    const admin = await dbService.create('admins', {
      email,
      password_hash,
      login_count: 0
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: { email: admin.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// FORGOT PASSWORD - Send reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: 'Email required' });

    const admins = await dbService.findAll('admins', { filter: { email } });
    const admin = admins[0];
    
    // Always return success to prevent email enumeration
    if (!admin) {
      return res.json({ success: true, message: 'If email exists, reset link has been sent' });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    await dbService.create('password_resets', {
      admin_id: admin.id,
      token,
      expires_at: expiresAt,
      used: false
    });

    // Send email
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: '[Portfolio] Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Use the token below:</p>
        <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <code style="font-size: 24px; color: #00e5ff; letter-spacing: 2px;">${token}</code>
        </div>
        <p>This token expires in <strong>1 hour</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    }).catch(err => console.error('Email send failed:', err));

    res.json({ success: true, message: 'If email exists, reset link has been sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword)
      return res.status(400).json({ success: false, message: 'Token and new password required' });
    
    if (newPassword.length < 8)
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

    // Find valid reset token
    const resets = await dbService.findAll('password_resets', { filter: { token, used: false } });
    const reset = resets[0];
    
    if (!reset)
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    // Check expiry
    if (new Date(reset.expires_at) < new Date())
      return res.status(400).json({ success: false, message: 'Token has expired' });

    // Update password
    const password_hash = await bcrypt.hash(newPassword, 12);
    await dbService.update('admins', reset.admin_id, { password_hash });

    // Mark token as used
    await dbService.update('password_resets', reset.id, { used: true });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// VERIFY
exports.verify = async (req, res) => {
  res.json({ success: true, data: { admin: req.admin } });
};