require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const studentRoutes = require('./routes/studentRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const studentPaymentRoutes = require("./routes/studentPayments");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => res.send('Dream Tuition Center API is running...'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', studentRoutes);
app.use('/api/receipts', receiptRoutes);
app.use("/api", studentPaymentRoutes);
app.use('/api/complaints', require('./routes/complaintRoutes'));


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
