const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  content: String,
  coverImage: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Series' },
  likeCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
// posts có thể thuộc Series 
// Có LikeCount để hiển thị số người thích

module.exports = mongoose.model('Post', postSchema);
