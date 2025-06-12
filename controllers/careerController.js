const mongoose = require('mongoose');
const Career = require('../models/Career');

// Create a new career post
exports.createCareer = async (req, res) => {
  try {
    const career = new Career(req.body);
    await career.save();
    res.status(201).json(career);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all career posts
exports.getCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ postedAt: -1 });
    res.json(careers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single career post
exports.getCareer = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid career ID' });
    }
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Not found' });
    res.json(career);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a career post
exports.updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!career) return res.status(404).json({ message: 'Not found' });
    res.json(career);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a career post
exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};