const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();
const Admin = require('../models/Admin');

// Create new admin
router.post('/create', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique adminId
    const adminId = `admin-${Date.now()}`;

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      adminId
    });

    await newAdmin.save();

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: newAdmin._id,
        adminId: newAdmin.adminId,
        email: newAdmin.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all admins
router.get('/getall', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password'); // hide passwords
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get admin by ID
router.get('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Optional: Send token or admin ID
    res.status(200).json({ message: 'Login successful', adminId: admin._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update admin
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If updating password, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedAdmin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete admin
router.delete('/delete/:id', async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
