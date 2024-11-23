const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
    trim: true,
  },
  image:{
    type: String,
  },
  currentDate: {
    type: Date,
    default: Date.now, // Automatically sets the date when the post is created
  },
  likes: {
    type: Array,
    default: [], // Default to 0 likes
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);