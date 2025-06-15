const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  avatar: String,
  bio: String,
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

  // Bookmark các post
  bookmarkedPostIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  // Danh sách các bài đã đọc trong từng series
  
  readProgress: [{
    seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Series' },
    readPostIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    updatedAt: { type: Date, default: Date.now }
  }]
});


// Hash mật khẩu trước khi lưu 
userSchema.pre('save', async function (next) {
  if(!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
})

// so sánh mật khẩu 
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};


module.exports = mongoose.models.User || mongoose.model('User', userSchema);
