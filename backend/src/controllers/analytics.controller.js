const dbService = require('../services/db.service');

exports.track = async (req, res) => {
  try {
    const ua = req.headers['user-agent'] || '';
    const device = /mobile/i.test(ua) ? 'mobile'
      : /tablet|ipad/i.test(ua) ? 'tablet' : 'desktop';

    await dbService.create('analytics', {
      page: req.body.page || '/',
      referrer: req.body.referrer || req.headers.referer || 'direct',
      user_agent: ua,
      ip_address: req.ip,
      device,
      session_id: req.body.sessionId || '',
      time_spent: req.body.timeSpent || 0,
    });

    res.json({ success: true });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const data = await dbService.getAnalyticsDashboard();
    res.json({ success: true, data });
  } catch (err) { 
    console.error('Analytics error:', err);
    res.status(500).json({ success: false, message: err.message }); 
  }
};