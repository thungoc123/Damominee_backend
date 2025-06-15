const Series = require('../models/series');

exports.createSeries = async (req, res) => {
     try {
          const { title, slug, postIds} = req.body;

          const existing = await Series.findOne({slug});
          if (existing) {
               return res.status(400).json({ message: 'Series with this slug already exists' });
          }
          const series = new Series({
               title,
               slug,
               postIds,
               authorId: req.user._id
          });
          await series.save();
          res.status(201).json({ message: 'Series created successfully', series });

     } catch (error) {
          console.error('Error creating series:', error);
          res.status(500).json({ message: 'Internal server error' });
     }
}
exports.getSeries = async (req, res) => {
     try {
          const series = await Series.find().populate('authorId', 'name email').populate('postIds', 'title slug');
          res.status(200).json(series);
     } catch (error) {
          console.error('Error fetching series:', error);
          res.status(500).json({ message: 'Internal server error' });
     }
}
     
exports.getSeriesById = async (req, res) => {
     try {
          const series = await Series.findById(req.params.id).populate('authorId', 'name email').populate('postIds', 'title slug');
          if (!series) {
               return res.status(404).json({ message: 'Series not found' });
          }
          res.status(200).json(series);
     } catch (error) {
          console.error('Error fetching series:', error);
          res.status(500).json({ message: 'Internal server error' });
     }
}

exports.updateSeries = async (req, res) => {
     try {
          const { title, slug, postIds } = req.body;
          
          const updated = await Series.findByIdAndUpdate(
               req.params.id,
               { title, slug, postIds },
               { new: true }
          ).populate('authorId', 'name email').populate('postIds', 'title slug');
          if (!updated) {
               return res.status(404).json({ message: 'Series not found' });
          }
          res.status(200).json({ message: 'Series updated successfully', series: updated });

     } catch (error) {
          console.error('Error updating series:', error);
          res.status(500).json({ message: 'Internal server error' });
     }

}

exports.deleteSeries = async (req, res) => {
     try {
          const deleted = await Series.findByIdAndDelete(req.params.id);
          if (!deleted) {
               return res.status(404).json({ message: 'Series not found' });
          }
          res.status(200).json({ message: 'Series deleted successfully' });
     } catch (error) {
          console.error('Error deleting series:', error);
          res.status(500).json({ message: 'Internal server error' });
     }
}


exports.reorderPostsInSeries = async (req, res) => {
     try {
          const { postIds} = req.body;
          const { id } = req.params;

          if( !Array.isArray(postIds) || postIds.length === 0) {
               return res.status(400).json({ message: 'Invalid post IDs' });
          }
          const series = await Series.findById(id);
          if (!series) {
               return res.status(404).json({ message: 'Series not found' });
          }

          const currentPostIds = series.postIds.map(post => post.toString());
          const sortedInput = [...postIds].sort();
          const sortedCurrent = [...currentPostIds].sort();
          if (JSON.stringify(sortedInput) !== JSON.stringify(sortedCurrent)) {
               return res.status(400).json({ message: 'Post IDs do not match the current series' });
          }
          series.postIds = postIds;
          await series.save();
          res.status(200).json({ message: 'Posts reordered successfully', series });
     } catch (error) {
          console.error('Error reordering posts in series:', error);
          res.status(500).json({ message: 'Internal server error' });
     }
}

exports.addPostToSeries = async (req, res) => {
     try {
          const { postId } = req.body;
          const { id } = req.params;

          if (!postId) {
               return res.status(400).json({ message: 'Post ID is required' });
          }

          const series = await Series.findById(id);
          if (!series) {
               return res.status(404).json({ message: 'Series not found' });
          }

          if (series.postIds.includes(postId)) {
               return res.status(400).json({ message: 'Post already exists in the series' });
          }

          series.postIds.push(postId);
          await series.save();
          res.status(200).json({ message: 'Post added to series successfully', series });
     } catch (error) {
          console.error('Error adding post to series:', error);
          res.status(500).json({ message: 'Internal server error' });
     }
}
exports.removePostFromSeries = async (req, res) => {
     try {
          const { postId } = req.body;
          const { id } = req.params;

          if (!postId) {
               return res.status(400).json({ message: 'Post ID is required' });
          }

          const series = await Series.findById(id);
          if (!series) {
               return res.status(404).json({ message: 'Series not found' });
          }

          if (!series.postIds.includes(postId)) {
               return res.status(400).json({ message: 'Post does not exist in the series' });
          }

          series.postIds = series.postIds.filter(post => post.toString() !== postId);
          await series.save();
          res.status(200).json({ message: 'Post removed from series successfully', series });
     } catch (error) {
          console.error('Error removing post from series:', error);
          res.status(500).json({ message: 'Internal server error' });
     }
}