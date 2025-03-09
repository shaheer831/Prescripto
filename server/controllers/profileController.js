const User = require("../models/User");
const fs = require("fs");

// Get Profile by ID
exports.getProfile = async (req, res) => {
  const user = req.user;
  
  try {
    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        status: user.status,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        picture: user.picture ? `${process.env.LINK}${user.picture}` : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile", error });
  }
};

exports.updateProfile = async (req, res) => {
  const filePath = req.file ? `/uploads/${req.file.filename}` : undefined;

  const userId = req.user._id; // Ensure the correct field is used
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const { dateOfBirth, gender, phoneNumber, username } = req.body;

  // Validate username
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  // Validate date of birth
  if (!dateOfBirth) {
    return res.status(400).json({ message: "Date of Birth is required" });
  } else if (isNaN(Date.parse(dateOfBirth))) {
    return res.status(400).json({ message: "Invalid Date of Birth format" });
  }

  // Validate gender
  const allowedGenders = ["male", "female", "other"];
  if (!gender) {
    return res.status(400).json({ message: "Gender is required" });
  } else if (!allowedGenders.includes(gender.toLowerCase())) {
    return res.status(400).json({
      message: `Gender must be one of the following: ${allowedGenders.join(
        ", "
      )}`,
    });
  }

  // Validate phone number
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format (international standard)
  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  } else if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  try {
    // Fetch the current user's profile to get the existing picture
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the previous picture if a new one is uploaded
    if (req.file && existingUser.picture) {
      const oldPicture = `.${existingUser.picture}`;
      try {
        fs.unlinkSync(oldPicture); // Attempt to delete the old picture
      } catch (error) {
        console.log(`Failed to delete file: ${oldPicture}. Skipping...`);
      }
    }

    // Update the user's profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { dateOfBirth, gender, phoneNumber, username, picture: filePath },
      { new: true } // This option returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        status: updatedUser.status,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        phoneNumber: updatedUser.phoneNumber,
        picture: updatedUser.picture
          ? `${process.env.LINK}${updatedUser.picture}`
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};
