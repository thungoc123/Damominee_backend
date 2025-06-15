const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth'); // ✅ sửa dòng này

router.post('/', auth, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.put('/:id', auth, categoryController.updateCategory);
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;