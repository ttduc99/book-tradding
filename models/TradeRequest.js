const mongoose = require('mongoose');

const TradeRequestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookOffered: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  bookRequested: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
});

module.exports = mongoose.model('TradeRequest', TradeRequestSchema);
