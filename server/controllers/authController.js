const jwt = require("jsonwebtoken");
const User = require("../models/User");
// Google Authentication Controller
exports.googleAuthController = async (req, res) => {
  try {
    const { id, displayName, email, picture } = req.user;

    let user = await User.findOne({ email });

    if (!user) {
      // If user does not exist, create a new user
      user = new User({
        username: displayName,
        password: id,
        email,
        picture,
        status: true,
      });
      await user.save();
    }

    if (user.isBlocked) {
      return res.status(400).json({ message: "User is blocked" });
    }

    // Create JWT tokens
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "365d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "Google login successful",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        picture: user.picture ? `${process.env.LINK}${user.picture}` : null,
        status: user.status,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Google login failed", error });
  }
};