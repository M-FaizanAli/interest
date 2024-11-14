const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/interest");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  dp: {
    type: String, // URL or path for the display picture
    default: '',  // Optional, can be set to a default value or empty string
  },
  posts: 
     [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
     }]
}, { timestamps: true });

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);