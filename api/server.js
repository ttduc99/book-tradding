const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

// connect MongoDB
mongoose.connect(process.env.MONGO_URI);

// routes
app.use('/api/books', require('../routes/books'));
app.use('/api/auth', require('../routes/auth'));
app.use('/api/trades', require('../routes/trades'));

// **Không dùng app.listen()**
module.exports = app;
module.exports.config = { maxDuration: 10 };
