const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     
     if(!token) return res.status(401).json({
          message: 'No token provided'
     });

     try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.id);
          if (!req.user) {
               return res.status(404).json({
                    message: 'User not found'
               });
          }
          next();
     } catch (err) {
          res.status(401).json({
               message: 'Invalid or expired token'
          });
     }
}

module.exports = auth;