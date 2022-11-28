// getting single user data
const express = require("express");
const Suggetions = express.Router();
const User = require("../../models/UserRegister");

Suggetions.get("/", async (req, res) => {
  // Get the count of all users
  try {
    User.count({}, (err, count) => {
      // Get a random entry
      let random = Math.floor(Math.random() * count) - 10;
      if (random < 0) {
        random = 1;
      }

      User.find()
        .skip(random)
        .limit(10)
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

module.exports = Suggetions;
