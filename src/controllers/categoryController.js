const Category = require('../models/category');

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
