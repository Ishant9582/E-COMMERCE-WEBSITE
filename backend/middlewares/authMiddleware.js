const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.authenticate = async (req, res, next) => {
  let token = req.cookies?.auth;

  if (!token){
    token = req.header('Authorization')?.replace('Bearer ', '');
  }
   

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();

  } catch (err) {
    if (err instanceof jwt.TokenExpiredError){
      return res.status(401).json({ message: 'Token expired' });
    }
    else if (err instanceof jwt.JsonWebTokenError){
      return res.status(401).json({ message: 'Invalid token' });
    }
    else if (err instanceof jwt.NotBeforeError){
      return res.status(401).json({ message: 'Token not active' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};
