const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET
console.log('✅ authRoutes loaded');

// hàm tạo JWT token 
const createToken = (user) => {
     return jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
     )
}

// đăng ký người dùng mới
router.post('/register', async (req, res) => {
     try {
          const { email, passwordHash } = req.body;
          const exist = await User.findOne({ email });
          if (exist) {
               return res.status(400).json({ message: 'Email đã được sử dụng' });
          }

          const user = await User.create({
               email, passwordHash
          });
          res.status(201).json({
               message: 'Register successfully'
          })
     } catch (error) {
          res.status(500).json({
               message: 'Lỗi server',
               error: error.message
          });
     }
});


// đăng nhập người dùng

router.post('/login', async (req, res) => {
     try {
          console.log('🔥 POST /login called');
          console.log('🧾 req.body:', req.body);
          const { email, passwordHash } = req.body;
          console.log(req.body)
          const user = await User.findOne({ email });
          if (!user || !(await user.comparePassword(passwordHash))) {
               return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
          }
          const token = createToken(user);
          res.status(200).json({
               message: 'Đăng nhập thành công',
               token,
               user: {
                    id: user.id,
                    email: user.email,
                    avatar: user.avatar,
                    bio: user.bio
               }
          });
     } catch (error) {
          res.status(500).json({
               message: 'Lỗi server',
               error: error.message
          });
     }
}
);

module.exports = router;