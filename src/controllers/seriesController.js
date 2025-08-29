const Series = require('../models/Series');
const Post = require('../models/Post');

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

// Lấy danh sách bài viết theo series slug với thứ tự
exports.getPostsBySeriesSlug = async (req, res) => {
     try {
          const { slug } = req.params;
          console.log('Searching for series with slug:', slug);
          
          const series = await Series.findOne({ slug }).populate('authorId', 'name email');
          if (!series) {
               return res.status(404).json({
                    message: 'Series not found'
               });
          }
          
          console.log('Found series:', series.title);
          console.log('Post IDs in series:', series.postIds);
          
          // Lấy chi tiết các bài viết theo thứ tự trong series
          // Chỉ lấy những bài viết đã được publish
          const posts = [];
          
          for (let postId of series.postIds) {
               const post = await Post.findById(postId)
                    .populate('authorId', 'name email')
                    .populate('categoryIds', 'name')
                    .populate('seriesId', 'title');
               
               // Chỉ thêm vào kết quả nếu bài viết đã được publish
               if (post && post.isPublish) {
                    posts.push(post);
               }
          }
          
          console.log('Number of published posts found:', posts.length);
          
          res.status(200).json({
               message: 'Posts retrieved successfully',
               series: {
                    title: series.title,
                    slug: series.slug,
                    author: series.authorId
               },
               posts,
               totalPosts: posts.length
          });
     } catch (error) {
          console.error('Error retrieving posts by series:', error);
          res.status(500).json({
               message: 'Internal server error',
               error: error.message
          });
     }
};

// Đồng bộ postIds trong series dựa trên seriesId trong posts
exports.syncSeriesPosts = async (req, res) => {
     try {
          const { id } = req.params; // Series ID
          
          const series = await Series.findById(id);
          if (!series) {
               return res.status(404).json({ message: 'Series not found' });
          }
          
          // Tìm tất cả posts có seriesId trùng với series này
          const posts = await Post.find({ seriesId: id }).select('_id title');
          
          // Cập nhật postIds trong series
          series.postIds = posts.map(post => post._id);
          await series.save();
          
          res.status(200).json({
               message: 'Series posts synchronized successfully',
               series,
               postsFound: posts.length,
               posts: posts
          });
     } catch (error) {
          console.error('Error syncing series posts:', error);
          res.status(500).json({ 
               message: 'Internal server error',
               error: error.message 
          });
     }
};

// Đồng bộ tất cả series
exports.syncAllSeriesPosts = async (req, res) => {
     try {
          const allSeries = await Series.find();
          const results = [];
          
          for (let series of allSeries) {
               // Tìm tất cả posts có seriesId trùng với series này
               const posts = await Post.find({ seriesId: series._id }).select('_id title');
               
               // Cập nhật postIds trong series
               series.postIds = posts.map(post => post._id);
               await series.save();
               
               results.push({
                    seriesId: series._id,
                    seriesTitle: series.title,
                    postsFound: posts.length,
                    postIds: series.postIds
               });
          }
          
          res.status(200).json({
               message: 'All series posts synchronized successfully',
               results
          });
     } catch (error) {
          console.error('Error syncing all series posts:', error);
          res.status(500).json({ 
               message: 'Internal server error',
               error: error.message 
          });
     }
};