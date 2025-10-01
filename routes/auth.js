const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup
router.post('/signup', async (req, res) => {
  const { username, password, fullName, city, state } = req.body;
  const user = new User({ username, password, fullName, city, state });
  await user.save();
  const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET);
  res.json({ token });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'User not found' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Wrong password' });
  const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET);
  res.json({ token });
});

// Update settings
router.put('/settings', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByIdAndUpdate(payload.id, req.body, {
    new: true,
  });
  res.json(user);
});

module.exports = router;
