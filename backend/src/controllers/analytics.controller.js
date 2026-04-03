const Analytics = require('../models/Analytics.model');

exports.track = async (req, res) => {
  try {
    const ua = req.headers['user-agent'] || '';
    const device = /mobile/i.test(ua) ? 'mobile'
      : /tablet|ipad/i.test(ua) ? 'tablet' : 'desktop';

    await Analytics.create({
      page: req.body.page || '/',
      referrer: req.body.referrer || req.headers.referer || 'direct',
      userAgent: ua,
      ipAddress: req.ip,
      device,
      sessionId: req.body.sessionId || '',
      timeSpent: req.body.timeSpent || 0,
    });

    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [total, todayVisits, deviceBreakdown, topPages, visitsByDay] = await Promise.all([
      Analytics.countDocuments(),
      Analytics.countDocuments({ createdAt: { $gte: todayStart } }),
      Analytics.aggregate([
        { $group: { _id: '$device', count: { $sum: 1 } } }
      ]),
      Analytics.aggregate([
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Analytics.aggregate([
        { $match: { createdAt: { $gte: last30 } } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } },
      ]),
    ]);

    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    deviceBreakdown.forEach(d => { devices[d._id] = d.count; });

    res.json({
      success: true,
      data: {
        totalVisits: total,
        todayVisits,
        deviceBreakdown: devices,
        topPages: topPages.map(p => ({ page: p._id, count: p.count })),
        visitsByDay: visitsByDay.map(v => ({ date: v._id, count: v.count })),
      }
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};