const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // hoặc true để cho tất cả origin
  credentials: true, // nếu frontend gửi cookie
}));
app.use(express.json()); 
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
// app.use('/api/posts', postRoutes);

module.exports = app;