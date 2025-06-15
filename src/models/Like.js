const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  createdAt: { type: Date, default: Date.now }
});

// Người dùng like hoặc bookmark bài 
// Cách này giúp tracking chính xác 
module.exports = mongoose.model('Like', likeSchema);
