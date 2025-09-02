const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController');
const auth = require('../middleware/auth'); // ✅ sửa dòng này


router.post('/', auth, seriesController.createSeries);
router.get('/', seriesController.getSeries);
router.get('/slug/:slug/posts', seriesController.getPostsBySeriesSlug);
router.get('/:id', seriesController.getSeriesById);
router.put('/:id', auth, seriesController.updateSeries);
router.delete('/:id', auth, seriesController.deleteSeries);
router.put('/:id/reorder-posts', auth, seriesController.reorderPostsInSeries);
router.put('/:id/add-post', auth, seriesController.addPostToSeries);
router.put('/:id/remove-post/:postId', auth, seriesController.removePostFromSeries);
router.post('/:id/sync-posts', auth, seriesController.syncSeriesPosts);
router.post('/sync-all', auth, seriesController.syncAllSeriesPosts);

module.exports = router;