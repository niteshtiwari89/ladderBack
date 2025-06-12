const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String },
  about: { type: String },
  description: { type: String, required: true },
  tags: [String],
  whatYouWillDo: [String],
  scope: { type: String },
  requirements: [String],
  experience: [String],
  benefits: [String],
  snippet: { type: String }, // Optional: for short preview
  category: { type: String },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Career', careerSchema);