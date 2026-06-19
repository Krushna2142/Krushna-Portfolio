const dbService = require('../services/db.service');

exports.getAll = async (req, res) => {
  try {
    const certs = await dbService.findAll('certifications', { 
      filter: { visible: true },
      sort: 'order_index',
      order: 'asc'
    });
    res.json({ success: true, data: certs });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

exports.adminGetAll = async (req, res) => {
  try {
    const certs = await dbService.findAll('certifications', { 
      sort: 'order_index',
      order: 'asc'
    });
    res.json({ success: true, data: certs });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

exports.create = async (req, res) => {
  try {
    const cert = await dbService.create('certifications', req.body);
    res.status(201).json({ success: true, data: cert });
  } catch (err) { 
    res.status(400).json({ success: false, message: err.message }); 
  }
};

exports.update = async (req, res) => {
  try {
    const cert = await dbService.update('certifications', req.params.id, req.body);
    if (!cert) return res.status(404).json({ success: false, message: 'Cert not found' });
    res.json({ success: true, data: cert });
  } catch (err) { 
    res.status(400).json({ success: false, message: err.message }); 
  }
};

exports.remove = async (req, res) => {
  try {
    await dbService.delete('certifications', req.params.id);
    res.json({ success: true, message: 'Certification deleted' });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};