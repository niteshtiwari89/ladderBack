const mongoose = require('mongoose'); // Import the mongoose library

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: {
    type: Number,
    required: true
  },
  message: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contact', contactSchema);  