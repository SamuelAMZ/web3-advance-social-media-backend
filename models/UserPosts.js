const mongoose = require("mongoose");

const posts = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
    max: 255,
  },
  postText: {
    type: String,
    required: [true, "post message"],
    max: 1024,
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
  actionViews: {
    type: String,
    default: "0",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Posts", posts);
