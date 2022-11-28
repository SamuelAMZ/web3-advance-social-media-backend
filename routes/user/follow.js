const express = require("express");
const FollowRoute = express.Router();
const Follows = require("../../models/Follow");
const User = require("../../models/UserRegister");

const Joi = require("@hapi/joi");

const schema = Joi.object({
  currentUserId: Joi.string().max(1024).required(),
  targetUserId: Joi.string().max(1024).required(),
  currentName: Joi.string().max(1024).required(),
  targetName: Joi.string().max(1024).required(),
});

FollowRoute.post("/", async (req, res) => {
  const { currentUserId, targetUserId, currentName, targetName } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      currentUserId,
      targetUserId,
      currentName,
      targetName,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  // FOLLOW TARGET USER
  // check if user already have followers
  try {
    const target = await Follows.findOne({ userId: targetUserId });

    // if target is null create its record
    if (!target || target === null) {
      const targetUser = new Follows({
        userId: targetUserId,
        name: targetName,
        followers: [currentUserId],
        followings: [],
      });
      await targetUser.save();
    }

    // if user following record exist, push to it
    if (target) {
      target.followers.push(currentUserId);
      await target.save();
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error following target please try again 1" });
  }

  // FOLLOWING CURRENT USER
  try {
    const current = await Follows.findOne({ userId: currentUserId });

    // if current is null create its record
    if (!current || current === null) {
      const currentUser = new Follows({
        userId: currentUserId,
        name: currentName,
        followers: [],
        followings: [targetUserId],
      });
      await currentUser.save();
    }

    // if user following record exist, push to it
    if (current) {
      current.followings.push(targetUserId);
      await current.save();
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error following target please try again 2" });
  }

  return res.status(200).json({ message: "follow successfully", code: "ok" });
});

module.exports = FollowRoute;
