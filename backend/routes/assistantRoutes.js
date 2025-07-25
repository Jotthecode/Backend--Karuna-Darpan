const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();
const Assistant = require('../models/Assistant');

// Create assistant
router.post('/create', async (req, res) => {
  const {
    assistantId, email, name, city, state, phone, password, assignedTherapist
  } = req.body;

  try {
    const existing = await Assistant.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Assistant already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAssistant = new Assistant({
      assistantId,
      email,
      name,
      city,
      state,
      phone,
      password: hashedPassword,
      assignedTherapist
    });

    await newAssistant.save();
    res.status(201).json({ message: 'Assistant created successfully', assistant: newAssistant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Assistant Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const assistant = await Assistant.findOne({ email });
    if (!assistant) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, assistant.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const assistantData = assistant.toObject();
    delete assistantData.password;

    // ✅ Add this line to rename _id to id
    assistantData.id = assistant._id;

    res.json({ message: 'Login successful', assistant: assistantData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all assistants
router.get('/getall', async (req, res) => {
  try {
    const assistants = await Assistant.find().select('-password');
    res.json(assistants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get assistant by ID
router.get('/:id', async (req, res) => {
  try {
    const assistant = await Assistant.findById(req.params.id).select('-password');
    if (!assistant) return res.status(404).json({ message: 'Assistant not found' });
    res.json(assistant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update assistant
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await Assistant.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete assistant
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await Assistant.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Assistant not found' });
    res.json({ message: 'Assistant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset assistant password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    const assistant = await Assistant.findOne({ email });
    if (!assistant) {
      return res.status(404).json({ message: 'Assistant not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    assistant.password = hashedPassword;
    await assistant.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;