const express = require("express");
const FollowList = express.Router();
const Follows = require("../../models/Follow");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  targetUsername: Joi.string().max(255).required(),
});

FollowList.post("/", async (req, res) => {
  const { targetUsername } = req.body;

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
  const usernameExist = await Follows.findOne({ name: targetUsername });
  if (usernameExist === "null" || !usernameExist) {
    return res.status(404).json({
      message: "User not valide 'code 005'",
      status: "false",
      user: "null",
    });
  }

  // send user data
  res.status(200).json({
    message: "user followings data fetched",
    status: "ok",
    users: {
      followers: usernameExist.followers,
      followings: usernameExist.followings,
    },
  });
});

module.exports = FollowList;
