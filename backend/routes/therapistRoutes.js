const express = require('express');
const router = express.Router();
const Therapist = require('../models/Therapist');

// Therapist CRUD routes (same structure as above)
router.post('/create', async (req, res) => {
  const { therapistId, email, name, specialization, city } = req.body;
  try {
    if (!therapistId || !email || !city) {
      return res.status(400).json({ error: 'therapistId, email, and city are required' });
    }

    const existing = await Therapist.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Therapist already exists' });

    const newTherapist = new Therapist({ therapistId, email, name, specialization, city });
    await newTherapist.save();
    res.status(201).json(newTherapist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/getall', async (req, res) => {
  try {
    const therapists = await Therapist.find();
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) return res.status(404).json({ message: 'Not found' });
    res.json(therapist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Therapist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    await Therapist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
