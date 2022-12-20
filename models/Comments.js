const mongoose = require("mongoose");

const Comment = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    max: 255,
  },
  postId: {
    type: String,
    required: true,
    max: 255,
  },
  commentText: {
    type: String,
    max: 1024,
  },
  commentImages: {
    type: Array,
  },
  likes: {
    type: String,
    max: 255,
    default: "0",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comments", Comment);
