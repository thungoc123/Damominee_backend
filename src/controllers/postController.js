const Post = require('../models/Post');
const Series = require('../models/Series');
const mongoose = require('mongoose');

// Create a new post
exports.createPost = async (req, res) => {
     try {
          const { title, slug, content, coverImage, categoryIds, seriesId } = req.body;
          const post = new Post({
               title,
               slug,
               content,
               coverImage,
               categoryIds,
               seriesId,
               authorId: req.user._id
          });
          await post.save();
          
          // Nếu có seriesId, thêm post vào series
          if (seriesId) {
               const series = await Series.findById(seriesId);
               if (series && !series.postIds.includes(post._id)) {
                    series.postIds.push(post._id);
                    await series.save();
               }
          }
          
          res.status(201).json({
               status: 'success',
               message: 'Post created successfully',
               post
          });

     } catch (error) {
          console.error('Error creating post:', error);
          res.status(500).json({
               message: 'Internal server error',
               error: error.message
          });
     }
};

exports.getPublishedPosts = async (req, res) => {
     try {
          const posts = await Post.find({ isPublish: true })
               .populate('authorId', 'name email')
               .populate('categoryIds', 'name')
               .populate('seriesId', 'title');
          res.status(200).json({
               message: 'Published posts retrieved successfully',
               posts
          });
     } catch (error) {
          console.error('Error retrieving published posts:', error);
          res.status(500).json({
               message: 'Internal server error',
               error: error.message
          });
     }
};
exports.getAllPosts = async (req, res) => {
     try {
          const posts = await Post.find().populate('authorId', 'name email').populate('categoryIds', 'name').populate('seriesId', 'title');
          res.status(200).json({
               message: 'Posts retrieved successfully',
               posts
          });
     } catch (error) {
          console.error('Error retrieving posts:', error);
          res.status(500).json({
               message: 'Internal server error',
               error: error.message
          });
     }
}

exports.getPostBySlug = async (req, res) => {
     try {
          const { slug } = req.params;
          console.log(slug);
          const post = await Post.findOne({ slug })
               .populate('authorId', 'name email')
               .populate('categoryIds', 'name')
               .populate('seriesId', 'title');
          if (!post) {
               return res.status(404).json({
                    message: 'Post not found'
               });
          }
          res.status(200).json({
               message: 'Post retrieved successfully',
               post
          });
     }
     catch (error) {
          console.error('Error retrieving post:', error);
          res.status(500).json({
               message: 'Internal server error',
               error: error.message
          });
     }
}

// Viết hàm getById tương tự như getPostBySlug nhưng tìm kiếm theo ID

exports.getById = async (req, res) => {
     try {
          const { id } = req.params;
          
          // Kiểm tra xem id có phải là ObjectId hợp lệ không
          if (!mongoose.Types.ObjectId.isValid(id)) {
               return res.status(400).json({
                    message: 'Invalid post ID format'
               });
          }
          
          const post = await Post.findById(id)
               .populate('authorId', 'name email')
               .populate('categoryIds', 'name')
               .populate('seriesId', 'title');
          if (!post) {
               return res.status(404).json({
                    message: 'Post not found'
               });
          }

          res.status(200).json({
               message: 'Post retrieved successfully',
               post
          });
     } catch (error) {
          console.error('Error retrieving post:', error);
          res.status(500).json({
               message: 'Internal server error',
               error: error.message
          });
     }
};

exports.updatePost = async (req, res) => {
     try {
          const { slug } = req.params;
          const { title, content, coverImage, categoryIds, seriesId } = req.body;

          // Lấy post hiện tại để so sánh seriesId
          const currentPost = await Post.findOne({ slug });
          if (!currentPost) {
               return res.status(404).json({
                    message: 'Post not found'
               });
          }

          const oldSeriesId = currentPost.seriesId;

          const post = await Post.findOneAndUpdate(
               { slug },
               { title, content, coverImage, categoryIds, seriesId },
               { new: true }
          );

          // Xử lý thay đổi seriesId
          if (oldSeriesId && oldSeriesId.toString() !== seriesId) {
               // Xóa post khỏi series cũ
               const oldSeries = await Series.findById(oldSeriesId);
               if (oldSeries) {
                    oldSeries.postIds = oldSeries.postIds.filter(id => id.toString() !== post._id.toString());
                    await oldSeries.save();
               }
          }

          if (seriesId && seriesId !== oldSeriesId?.toString()) {
               // Thêm post vào series mới
               const newSeries = await Series.findById(seriesId);
               if (newSeries && !newSeries.postIds.includes(post._id)) {
                    newSeries.postIds.push(post._id);
                    await newSeries.save();
               }
          }

          res.status(200).json({
               status: 'success',
               message: 'Post updated successfully',
               post
          });
     } catch (error) {
          console.error('Error updating post:', error);
          res.status(500).json({
               message: 'Internal server error',
               error: error.message
          });
     }
};

exports.deletePost = async (req, res) => {
     try {
          const { slug } = req.params;
          const post = await Post.findOneAndDelete({ slug });
          if (!post) {
               return res.status(404).json({
                    message: 'Post not found'
               });
          }

          res.status(200).json({
               status: 'success',
               message: 'Post deleted successfully',
               post
          });
     } catch (error) {
     console.error('Error deleting post:', error);
     res.status(500).json({
          message: 'Internal server error',
          error: error.message
     });
}
}



exports.updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublish } = req.body;

    if (typeof isPublish !== 'boolean') {
      return res.status(400).json({ message: '`isPublish` must be true or false' });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { isPublish },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      status: 'success',
      message: `Post has been ${isPublish ? 'published' : 'unpublished'} successfully`,
      post
    });
  } catch (error) {
    console.error('Error updating post status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};