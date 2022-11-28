const express = require("express");
const UserDataRoute = express.Router();
const User = require("../../models/UserRegister");
const Follows = require("../../models/Follow");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  targetUsername: Joi.string().max(255).required(),
  currentUserId: Joi.string().max(255).required(),
});

UserDataRoute.post("/", async (req, res) => {
  const { targetUsername, currentUserId } = req.body;

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
      currentUserId,
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

  // get user following data
  let followersCount = 0;
  let followingCount = 0;
  let alreadyFollow = false;

  const targetUser = await Follows.findOne({ userId: usernameExist._id });
  if (targetUser) {
    followersCount = targetUser.followers.length;
    followingCount = targetUser.followings.length;

    // check if current user follow target user
    for (let i = 0; i < targetUser.followers.length; i++) {
      if (targetUser.followers[i].match(currentUserId)) {
        alreadyFollow = true;
      }
    }
  }

  // send user data
  res.status(200).json({
    message: "user fetched",
    status: "true",
    user: {
      alreadyFollow,
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
      following: followingCount,
      followers: followersCount,
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
