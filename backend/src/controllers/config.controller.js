const SiteConfig = require('../models/SiteConfig.model');

exports.getAll = async (req, res) => {
  try {
    const configs = await SiteConfig.find();
    const result = {};
    configs.forEach(c => { result[c.key] = c.value; });
    res.json({ success: true, data: result });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const config = await SiteConfig.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: config });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};