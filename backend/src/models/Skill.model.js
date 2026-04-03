const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: [
      'Frontend', 'Backend', 'Mobile', 'Database',
      'DevOps', 'AI/ML', 'Languages', 'Tools', 'Soft Skills'
    ],
    required: true,
  },
  proficiency: { type: Number, min: 0, max: 100, default: 80 },
  icon: { type: String },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);