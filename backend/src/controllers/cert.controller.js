const Certification = require('../models/Certification.model');

exports.getAll = async (req, res) => {
  try {
    const certs = await Certification.find({ visible: true }).sort({ order: 1 });
    res.json({ success: true, data: certs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.adminGetAll = async (req, res) => {
  try {
    const certs = await Certification.find().sort({ order: 1 });
    res.json({ success: true, data: certs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const cert = await Certification.create(req.body);
    res.status(201).json({ success: true, data: cert });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cert) return res.status(404).json({ success: false, message: 'Cert not found' });
    res.json({ success: true, data: cert });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Certification deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};