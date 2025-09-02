const Category = require('../models/Category');
const Post = require('../models/Post');

exports.createCategory = async (req, res) => {
     try {
          const { name, slug } = req.body;

          const existing = await Category.findOne({slug});
          if(existing) {
               return res.status(400).json({
                    message: 'Category with this slug already exists'
               })
          }
          const category = new Category({
               name,
               slug
          });
          await category.save();
          res.status(201).json({
               message: 'Category created successfully',
               category
          });
     } catch (error) {
          console.error('Error creating category:', error);
          res.status(500).json({
               message: 'Internal server error',
               error: error.message
          });
     }
};

exports.getCategories = async (req, res) => {
     try {
          const categories = await Category.find();
          res.status(200).json({
               message: 'Categories retrieved successfully',
               categories
          });
     } catch (error) {
          console.error('Error retrieving categories:', error);
          res.status(500).json({
               message: 'Internal server error',
               error: error.message
          });
     }
};

exports.updateCategory = async (req, res) => {
     try {
          const { name, slug} = req.body;

          const updated = await Category.findByIdAndUpdate(
               req.params.id,
               { name, slug },
               { new: true, runValidators: true }
          );

          if (!updated) {
               return res.status(404).json({
                    message: 'Category not found'
               });
          }

          res.json({
               message: 'Category updated successfully',
               category: updated
          });

     } catch (error) {
          console.error('Error updating category:', error);
          res.status(500).json({
               message: 'Internal server error',
               error: error.message
          });
     }
};

exports.deleteCategory = async (req, res) => {
     try {
          const deleted = await Category.findByIdAndDelete(req.params.id);
          if (!deleted) {
               return res.status(404).json({
                    message: 'Category not found'
               });
          }
          res.status(200).json({
               message: 'Category deleted successfully'
          });
     } catch (error) {
          console.error('Error deleting category:', error);
          res.status(500).json({
               message: 'Internal server error',
               error: error.message
          });
     }
}

exports.getPostsByCategorySlug = async (req, res) => {
     try {
          const { slug } = req.params;
          console.log('Searching for category with slug:', slug);
          
          const category = await Category.findOne({ slug });
          if (!category) {
               return res.status(404).json({
                    message: 'Category not found'
               });
          }
          
          console.log('Found category:', category);
          console.log('Category ID:', category._id);
          
          // Lấy các bài viết đã publish theo category
          // Nếu Post có trường categoryIds là mảng các ObjectId tham chiếu Category
          // Lấy các bài viết đã publish mà categoryIds chứa category._id
          const posts = await Post.find({ 
               categoryIds: { $in: [category._id] }, 
               isPublish: true 
          }).populate('authorId', 'name email')
            .populate('categoryIds', 'name')
            .populate('seriesId', 'title');
          
          console.log('Found posts:', posts);
          console.log('Number of posts found:', posts.length);
          
          res.status(200).json({
               message: 'Posts retrieved successfully',
               posts,
               category: {
                    name: category.name,
                    slug: category.slug
               }
          });
     } catch (error) {
          console.error('Error retrieving posts by category:', error);
          res.status(500).json({
               message: 'Internal server error',
               error: error.message
          });
     }
};