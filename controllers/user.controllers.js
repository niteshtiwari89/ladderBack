const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); // Adjust the path based on your structure

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password }); // Log the credentials received

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Invalid username'); // Log invalid username
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password'); // Log invalid password
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Server error:', error); // Log server error
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  // Clear the token on the client side
  res.json({ message: 'Logout successful' });
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Server error:', error); // Log server error
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;