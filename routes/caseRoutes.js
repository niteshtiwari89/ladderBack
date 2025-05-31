const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const Case = require('../models/Case');
const authenticateToken = require("../middlewares/authMiddleware")

// Cloudinary configuration
const cloudinaryBaseUrl = 'https://api.cloudinary.com/v1_1/dxo0r3jgb/image/upload'; // Replace with your Cloudinary base URL
const uploadPreset = 'tarscasesimage'; // Replace with your unsigned preset name

// Configure Multer to store files in memory (not locally)
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage }); // Use memory storage


// Add a new case with Cloudinary image upload
router.post('/', upload.single('image'), authenticateToken,async (req, res) => {
  try {
    const { title, technologies, figmaProvider, whatWasBuild, whatWeAdded, problemBefore, problemSolved, author } = req.body;

    let imageUrl = '';

    // If an image is uploaded, upload it to Cloudinary
    if (req.file) {
      try {
        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname); // Use the buffer from memory storage
        formData.append('upload_preset', uploadPreset);

        const response = await axios.post(cloudinaryBaseUrl, formData, {
          headers: { ...formData.getHeaders() },
        });

        imageUrl = response.data.secure_url; // Get the Cloudinary image URL
      } catch (uploadError) {
        return res.status(500).json({ message: 'Failed to upload image to Cloudinary', error: uploadError.message });
      }
    }

    const newCase = new Case({
      title,
      technologies,
      figmaProvider,
      whatWasBuild,
      whatWeAdded,
      problemSolved,
      problemBefore,
      author,
      image: imageUrl, // Save Cloudinary URL for the image
    });

    // Save the case in the database
    await newCase.save();

    res.status(201).json(newCase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all cases
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single case by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const caseItem = await Case.findById(id);
    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.json(caseItem);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching case' });
  }
});

// Delete a case by ID
router.delete('/:id', authenticateToken,async (req, res) => {
  try {
    const caseItem = await Case.findByIdAndDelete(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

