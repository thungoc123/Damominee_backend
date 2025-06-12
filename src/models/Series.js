const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Series', seriesSchema);
