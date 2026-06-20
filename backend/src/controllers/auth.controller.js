const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Resend } = require('resend');
const dbService = require('../services/db.service');
const { JWT_SECRET, JWT_EXPIRES_IN, REGISTRATION_SECRET } = require('../config/constants');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

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
      login_count: (admin.login_count || 0) + 1
    });

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: { token, email: admin.email, lastLogin: admin.last_login }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password, registrationSecret } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });
    if (password.length < 8)
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    if (registrationSecret !== REGISTRATION_SECRET)
      return res.status(403).json({ success: false, message: 'Invalid registration secret' });

    const existing = await dbService.findAll('admins', { filter: { email } });
    if (existing.length > 0)
      return res.status(400).json({ success: false, message: 'Admin already exists' });

    const password_hash = await bcrypt.hash(password, 12);
    const admin = await dbService.create('admins', { email, password_hash, login_count: 0 });

    res.status(201).json({ success: true, message: 'Admin created successfully', data: { email: admin.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// FORGOT PASSWORD (Uses Resend + admins table)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const admins = await dbService.findAll('admins', { filter: { email } });
    const admin = admins[0];

    // Always return success to prevent email enumeration
    if (!admin) {
      return res.json({ success: true, message: 'If email exists, reset link has been sent' });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    // Save token directly to the admin record
    await dbService.update('admins', admin.id, {
      reset_token: token,
      reset_token_expiry: expiresAt
    });

    // Send email via Resend in background (Fire and forget)
    resend.emails.send({
      from: 'Portfolio Admin <onboarding@resend.dev>',
      to: ADMIN_EMAIL, // Send to your verified admin email
      subject: '[Portfolio] Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>A password reset was requested for your admin account.</p>
          <p style="margin: 20px 0;">
            <strong>Your reset token:</strong><br/>
            <code style="background: #f0f0f0; padding: 10px; display: inline-block; border-radius: 4px; font-size: 16px; letter-spacing: 2px;">
              ${token}
            </code>
          </p>
          <p>This token will expire in <strong>1 hour</strong>.</p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    }).then(() => console.log('✅ Reset email sent')).catch(err => console.error('❌ Reset email failed:', err));

    res.json({ success: true, message: 'If email exists, reset link has been sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
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

    // Find admin with valid, non-expired reset token
    const admins = await dbService.findAll('admins', { 
      filter: { 
        reset_token: token,
        reset_token_expiry: { $gte: new Date().toISOString() } // Custom filter logic might be needed here
      } 
    });
    
    // Fallback manual check if dbService filter doesn't support $gte for dates perfectly
    const admin = admins.find(a => new Date(a.reset_token_expiry) > new Date());

    if (!admin)
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    // Update password and clear reset token
    const password_hash = await bcrypt.hash(newPassword, 12);
    await dbService.update('admins', admin.id, {
      password_hash,
      reset_token: null,
      reset_token_expiry: null
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// VERIFY
exports.verify = async (req, res) => {
  res.json({ success: true, data: { admin: req.admin } });
};