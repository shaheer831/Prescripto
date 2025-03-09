const User = require("../models/dashboardUser");
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the Authorization header
  if (!token) return res.sendStatus(403); // Forbidden if no token is provided

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user and populate the 'role' field
    const user = await User.findOne({ email: decoded.email }).populate('role');
    if (!user) return res.sendStatus(404); // Not found if user doesn't exist

    req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    return res.sendStatus(403); // Invalid token
  }
};

module.exports = authenticateToken;
