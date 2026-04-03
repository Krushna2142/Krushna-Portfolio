const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  page: { type: String, required: true },
  referrer: { type: String, default: 'direct' },
  userAgent: { type: String },
  ipAddress: { type: String },
  country: { type: String },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: 'desktop',
  },
  sessionId: { type: String },
  timeSpent: { type: Number, default: 0 }, // seconds
}, { timestamps: true });

// Index for fast dashboard queries
analyticsSchema.index({ createdAt: -1 });
analyticsSchema.index({ page: 1, createdAt: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);