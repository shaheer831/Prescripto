const express = require('express');
const {
    getProfile,
    updateProfile,
    // deleteProfile
} = require('../controllers/profileController.js');
const router = express.Router();
const authMiddleware = require('./../middleware/authMiddleware.js')
const upload = require('./../multer.js')

// Get a profile by ID
router.get('/', authMiddleware, getProfile);

// Update a profile by ID
router.post('/', authMiddleware, upload.single('picture'), updateProfile);

module.exports = router;
