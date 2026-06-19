const dbService = require('../services/db.service');

exports.getAll = async (req, res) => {
  try {
    const configs = await dbService.getAllConfigs();
    res.json({ success: true, data: configs });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

exports.update = async (req, res) => {
  try {
    const config = await dbService.updateConfig(req.params.key, req.body.value);
    res.json({ success: true, data: config });
  } catch (err) { 
    console.error('Config update error:', err);
    res.status(500).json({ success: false, message: err.message }); 
  }
};