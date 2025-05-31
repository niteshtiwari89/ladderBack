const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password }); // Log the credentials received

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Invalid username'); // Log invalid username
      return res.status(400).json({ message: 'Invalid username ' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password'); // Log invalid password
      return res.status(400).json({ message: 'Invalid or password' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Server error:', error); // Log server error
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save the user in the database
    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Server error:', error); // Log server error
    res.status(500).json({ message: 'Server Error', error });
  }
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