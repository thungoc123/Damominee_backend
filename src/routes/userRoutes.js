const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // ✅ sửa dòng này

router.get('/', auth, userController.getAllUsers); // Lấy tất cả người dùng, yêu cầu xác thực

module.exports = router;