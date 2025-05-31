// const mongoose = require('mongoose');

// const blogSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   author: { type: String, required: true },
//   image: { type: String },
// }, { timestamps: true });

// module.exports = mongoose.model('Blog', blogSchema);


// models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })},
  readTime: { type: String, required: true },
  snippet: { type: String, required: true },
  featured: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);