const express = require("express");
const passport = require("passport");
require("../config/passport");
const {
  googleAuthController
} = require("../controllers/authController");
const router = express.Router();

// auth route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthController 
);

module.exports = router;
