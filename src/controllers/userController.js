const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash'); // Ẩn mật khẩu

    res.json({
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};