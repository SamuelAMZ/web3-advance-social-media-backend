const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username alreaddy exist"],
    unique: [true, "username alreaddy exist"],
    min: 4,
    max: 255,
  },
  name: {
    type: String,
    required: [true, "Verify name"],
    min: 4,
    max: 255,
  },
  email: {
    type: String,
    required: [true, "email alreaddy exist"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Verify password"],
    min: 6,
    max: 1050,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", user);
