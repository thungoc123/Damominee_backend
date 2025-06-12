const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true }
});

module.exports = mongoose.model('Category', categorySchema);
