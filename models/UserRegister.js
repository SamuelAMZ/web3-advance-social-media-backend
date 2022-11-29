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
  tags: {
    type: String,
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
  lastname: {
    type: String,
    default: "",
    min: 4,
    max: 255,
  },
  firstname: {
    type: String,
    default: "",
    min: 4,
    max: 255,
  },
  desc: {
    type: String,
    default: "no bio yet",
    min: 4,
    max: 1024,
  },
  website: {
    type: String,
    default: "no link yet",
    min: 3,
    max: 255,
  },
  country: {
    type: String,
    default: "no country yet",
    min: 4,
    max: 255,
  },
  gender: {
    type: String,
    default: "male",
    max: 255,
  },
  bdate: {
    type: String,
    default: "0/0/0",
    min: 4,
    max: 255,
  },
  following: {
    type: String,
    default: "0",
  },
  followers: {
    type: String,
    default: "0",
  },
  profileicon: {
    normal: {
      type: String,
      default:
        "https://res.cloudinary.com/dm7pcraut/image/upload/v1669652946/profiles/Untitled_design_46_1_s9rdj8.jpg",
      max: 1050,
    },
    thumb: {
      type: String,
      default:
        "https://res.cloudinary.com/dm7pcraut/image/upload/v1669652946/profiles/Untitled_design_46_1_s9rdj8.jpg",
      max: 1050,
    },
  },
  profileback: {
    normal: {
      type: String,
      default:
        "https://res.cloudinary.com/dm7pcraut/image/upload/v1669652946/profiles/Untitled_design_18_1_oatvts.jpg",
      max: 1050,
    },
  },
});

module.exports = mongoose.model("User", user);
