const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    admin.lastLogin = new Date();
    admin.loginCount += 1;
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: { token, email: admin.email, lastLogin: admin.lastLogin }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verify = async (req, res) => {
  res.json({ success: true, data: { admin: req.admin } });
};