// middleware/authMiddleware.js
const User = require("../models/User");
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(403);

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.sendStatus(404);
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(403); // Invalid token
  }
};

module.exports = authenticateToken;
