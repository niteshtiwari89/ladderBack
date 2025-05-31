const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const authenticateToken = require("../middlewares/authMiddleware")

router.post('/', authenticateToken,async (req, res) => {
  try {
    const { name, email, number, message } = req.body;
    // console.log(req.body)
    const contact = new Contact({ name, email, number, message });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// New route for deleting a contact
router.delete('/:id', authenticateToken,async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


