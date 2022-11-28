// getting single user data
const express = require("express");
const WhoToFollow = express.Router();
const User = require("../../models/UserRegister");

WhoToFollow.get("/", async (req, res) => {
  // Get the count of all users
  try {
    User.count({}, (err, count) => {
      // Get a random entry
      let random = Math.floor(Math.random() * count) - 3;
      if (random < 0) {
        random = 1;
      }

      // Again query all users but only fetch one offset by our random #
      User.find()
        .skip(random)
        .limit(3)
        .exec((err, result) => {
          res
            .status(200)
            .json({ message: "good", status: "ok", users: result });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error getting users" });
  }
});

module.exports = WhoToFollow;
