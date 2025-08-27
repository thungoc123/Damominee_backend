const express = require('express');
const postController = require('../controllers/postController');
const auth = require('../middleware/auth'); // ✅ sửa dòng này
const router = express.Router();

router.post('/', auth, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:slug', postController.getPostBySlug);
router.put('/:slug', auth, postController.updatePost);
router.delete('/:slug', auth, postController.deletePost);
router.patch('/:id/publish', auth, postController.updatePostStatus);
module.exports = router;