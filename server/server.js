// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();
// Middleware

app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Google Sign-In</title>
      </head>
      <body style="display: flex; justify-content: center; align-items: center;">
        <a href="/api/auth/google" style="
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background-color: #4285F4; 
          color: white; 
          padding: 10px 20px; 
          text-decoration: none; 
          font-size: 16px; 
          border-radius: 5px;
          font-family: Arial, sans-serif;
        ">
          Sign in with Google
        </a>
      </body>
    </html>
  `);
});


app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
