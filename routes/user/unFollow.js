const express = require("express");
const FollowRoute = express.Router();
const Follows = require("../../models/Follow");
const User = require("../../models/UserRegister");

const Joi = require("@hapi/joi");

const schema = Joi.object({
  currentUserId: Joi.string().max(1024).required(),
  targetUserId: Joi.string().max(1024).required(),
});

FollowRoute.post("/", async (req, res) => {
  const { currentUserId, targetUserId, type } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      currentUserId,
      targetUserId,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  // UNFOLLOW TARGET USER
  try {
    const target = await Follows.findOne({ userId: targetUserId });

    // if user following record exist, push to it
    if (target) {
      target.followers.pull(currentUserId);
      await target.save();
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error following target please try again 1" });
  }

  // UNFOLLOWING CURRENT USER
  try {
    const current = await Follows.findOne({ userId: currentUserId });

    // if user following record exist, push to it
    if (current) {
      current.followings.pull(targetUserId);
      await current.save();
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error following target please try again 2" });
  }

  return res.status(200).json({ message: "unfollow successfully", code: "ok" });
});

module.exports = FollowRoute;
