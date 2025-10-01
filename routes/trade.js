const express = require('express');
const router = express.Router();
const TradeRequest = require('../models/TradeRequest');
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

// Create trade request
router.post('/', authMiddleware, async (req, res) => {
  const trade = new TradeRequest({ ...req.body, fromUser: req.user.id });
  await trade.save();
  res.json(trade);
});

// Accept or reject trade
router.put('/:id', authMiddleware, async (req, res) => {
  const trade = await TradeRequest.findById(req.params.id);
  if (!trade) return res.status(404).json({ error: 'Not found' });
  if (trade.toUser.toString() !== req.user.id)
    return res.status(403).json({ error: 'Forbidden' });
  trade.status = req.body.status;
  await trade.save();
  res.json(trade);
});

// Get all trades
router.get('/', authMiddleware, async (req, res) => {
  const trades = await TradeRequest.find().populate(
    'fromUser toUser bookOffered bookRequested'
  );
  res.json(trades);
});

module.exports = router;
