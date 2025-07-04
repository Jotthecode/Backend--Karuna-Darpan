const express = require('express');
const router = express.Router();
const Assistant = require('../models/Assistant');

router.post('/create', async (req, res) => {
  const { assistantId, email, name, city } = req.body;
  try {
    const existing = await Assistant.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Assistant already exists' });

    const newAssistant = new Assistant({ assistantId, email, name, city });
    await newAssistant.save();
    res.status(201).json(newAssistant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/getall', async (req, res) => {
  try {
    const assistants = await Assistant.find();
    res.json(assistants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const assistant = await Assistant.findById(req.params.id);
    if (!assistant) return res.status(404).json({ message: 'Not found' });
    res.json(assistant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Assistant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    await Assistant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
