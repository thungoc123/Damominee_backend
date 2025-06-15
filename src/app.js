const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // hoặc true để cho tất cả origin
  credentials: true, // nếu frontend gửi cookie
}));
app.use(express.json()); 
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const seriesRoutes = require('./routes/seriesRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/series', seriesRoutes);
// app.use('/api/posts', postRoutes);

module.exports = app;