const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  techStack: [{ type: String, trim: true }],
  category: {
    type: String,
    enum: ['AI', 'Web', 'Mobile', 'Backend', 'Other'],
    default: 'Web',
  },
  thumbnail: { type: String },
  images: [{ type: String }],
  liveUrl: { type: String },
  githubUrl: { type: String },
  featured: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);