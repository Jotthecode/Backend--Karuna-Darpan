const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  abhaId: { type: String, required: true, unique: true },
  phone: String,
  city: String,
  assignedTherapist: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist' }
});

module.exports = mongoose.model('Patient', patientSchema);
