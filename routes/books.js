const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');

// Middleware auth
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all books
router.get('/', async (req, res) => {
  const books = await Book.find().populate('owner', 'username fullName');
  res.json(books);
});

// Add book
router.post('/', authMiddleware, async (req, res) => {
  const book = new Book({ ...req.body, owner: req.user.id });
  await book.save();
  res.json(book);
});

module.exports = router;
