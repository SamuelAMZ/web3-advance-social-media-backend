const mongoose = require("mongoose");

const Booksmark = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
    max: 255,
  },
  posts: {
    type: Array,
  },
});

module.exports = mongoose.model("Booksmarks", Booksmark);
