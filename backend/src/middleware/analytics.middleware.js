const Analytics = require('../models/Analytics.model');

module.exports = async (req, res, next) => {
  try {
    const ua = req.headers['user-agent'] || '';
    const device = /mobile/i.test(ua) ? 'mobile'
      : /tablet|ipad/i.test(ua) ? 'tablet' : 'desktop';

    await Analytics.create({
      page: req.path,
      referrer: req.headers.referer || 'direct',
      userAgent: ua,
      ipAddress: req.ip,
      device,
      sessionId: req.headers['x-session-id'] || '',
    });
  } catch (_) { /* never block the request */ }
  next();
};