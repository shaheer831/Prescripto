const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    default: null,
  },
  phoneNumber: {
    type: String,
    default: null,
  },
  picture: {
    type: String,
    default: null,
  }
});

module.exports = mongoose.model('User', userSchema);
