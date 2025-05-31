const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const Product = require('../models/Product');
const authenticateToken = require("../middlewares/authMiddleware")

// Cloudinary configuration
const cloudinaryBaseUrl = 'https://api.cloudinary.com/v1_1/dxo0r3jgb/image/upload'; // Replace with your Cloudinary base URL
const uploadPreset = 'tarsproductimage'; // Replace with your unsigned preset name

// Configure Multer to store files in memory (not locally)
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage }); // Use memory storage

// Route for creating a new product
router.post('/', upload.single('image'), authenticateToken,async (req, res) => {
  try {
    const { name, description } = req.body;

    let imageUrl = '';  // Initialize empty imageUrl

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

    // Create a new product with Cloudinary image URL
    const product = new Product({
      name,
      description,
      image: imageUrl, // Save Cloudinary URL for the image
    });

    // Save the product in the database
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route for getting all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for deleting a product by ID
router.delete('/:id', authenticateToken,async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for getting a single product by ID (to be used in ProductDetailPage)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

