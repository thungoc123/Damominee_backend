const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController');
const auth = require('../middleware/auth'); // ✅ sửa dòng này


router.post('/', auth, seriesController.createSeries);
router.get('/', seriesController.getSeries);
router.get('/:id', seriesController.getSeriesById);
router.put('/:id', auth, seriesController.updateSeries);
router.delete('/:id', auth, seriesController.deleteSeries);
router.put('/:id/reorder-posts', auth, seriesController.reorderPostsInSeries);
router.post('/:id/add-post', auth, seriesController.addPostToSeries);
router.delete('/:id/remove-post/:postId', auth, seriesController.removePostFromSeries);

module.exports = router;