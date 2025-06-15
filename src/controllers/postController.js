const Post = require('../models/Post');

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
          res.status(201).json({
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

exports.updatePost = async (req, res) => {
     try {
          const { slug } = req.params;
          const { title, content, coverImage, categoryIds, seriesId } = req.body;

          const post = await Post.findOneAndUpdate(
               { slug },
               { title, content, coverImage, categoryIds, seriesId },
               { new: true }
          );

          if (!post) {
               return res.status(404).json({
                    message: 'Post not found'
               });
          }

          res.status(200).json({
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
          message: 'Post deleted successfully',
          post
     });
}
     catch (error) {
     console.error('Error deleting post:', error);
     res.status(500).json({
          message: 'Internal server error',
          error: error.message
     });
}
}
