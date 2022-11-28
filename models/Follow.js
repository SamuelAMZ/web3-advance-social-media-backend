const mongoose = require("mongoose");

const follow = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
    max: 255,
  },
  name: {
    type: String,
    max: 255,
  },
  followers: {
    type: Array,
  },
  followings: {
    type: Array,
  },
});

module.exports = mongoose.model("Follows", follow);
