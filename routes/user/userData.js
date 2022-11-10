const express = require("express");
const UserDataRoute = express.Router();
const User = require("../../models/UserRegister");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  targetUsername: Joi.string().max(255).required(),
});

UserDataRoute.post("/", async (req, res) => {
  const { targetUsername } = req.body;

  if ((targetUsername === "", targetUsername === null)) {
    return res
      .status(400)
      .json({ message: "nothing", status: "false", user: "null" });
  }

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      targetUsername,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  // try to find user
  const usernameExist = await User.findOne({ username: targetUsername });
  if (usernameExist === "null" || !usernameExist) {
    return res.status(404).json({
      message: "User not valide 'code 005'",
      status: "false",
      user: "null",
    });
  }

  // send user data
  res.status(200).json({
    message: "user fetched",
    status: "true",
    user: {
      email: usernameExist.email,
      username: usernameExist.username,
      name: usernameExist.name,
      id: usernameExist._id,
      date: usernameExist.date,
      lastname: usernameExist.lastname,
      firstname: usernameExist.firstname,
      desc: usernameExist.desc,
      website: usernameExist.website,
      country: usernameExist.country,
      gender: usernameExist.gender,
      bdate: usernameExist.bdate,
      following: usernameExist.following,
      followers: usernameExist.followers,
      profileicon: {
        normal: usernameExist.profileicon.normal,
        thumb: usernameExist.profileicon.thumb,
      },
      profileback: {
        normal: usernameExist.profileback.normal,
      },
    },
  });
});

module.exports = UserDataRoute;
