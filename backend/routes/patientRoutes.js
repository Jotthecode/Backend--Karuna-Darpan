const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Create patient
// Create patient
router.post('/create', async (req, res) => {
  const { abhaId, email, name, age, phone } = req.body;
  try {
    const existing = await Patient.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Patient already exists' });

    const newPatient = new Patient({ abhaId, email, name, age, phone });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all patients
router.get('/getAll', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update patient
router.put('/update', async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete patient
router.delete('/delete', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
