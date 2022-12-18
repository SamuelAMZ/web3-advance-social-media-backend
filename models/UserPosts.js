const mongoose = require("mongoose");

const posts = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
    max: 255,
  },
  postType: {
    type: String,
    default: "normal",
  },

  postText: {
    type: String,
    max: 1024,
  },
  postImages: {
    type: Array,
  },
  comments: {
    type: Array,
    default: [],
  },
  reposts: {
    type: Array,
    default: [],
  },
  likes: {
    type: Array,
    default: [],
  },
  actionComments: {
    type: String,
    default: "0",
  },
  actionReposts: {
    type: String,
    default: "0",
  },
  actionLikes: {
    type: String,
    default: "0",
  },
  repostNote: {
    type: String,
    max: 1024,
  },
  originalUId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Posts", posts);
