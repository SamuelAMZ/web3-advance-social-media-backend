const express = require("express");
const FindPostOwner = express.Router();
const User = require("../../models/UserRegister");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  ownerId: Joi.string().max(1050).required(),
  repostId: Joi.string().max(1050).allow(""),
});

FindPostOwner.post("/", async (req, res) => {
  const { ownerId, repostId } = req.body;

  if ((ownerId === "", ownerId === null)) {
    return res
      .status(400)
      .json({ message: "nothing", status: "false", user: "null" });
  }

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      ownerId,
      repostId,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   find user
  try {
    const owner = await User.findById(ownerId);

    let originalU = "";
    // find original user if it s repost
    if (repostId && repostId !== "") {
      originalU = await User.findById(repostId);
    }

    return res.json({
      message: "users fetched",
      status: "true",
      data: owner,
      originalU,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error finding post owner id ${ownerId}` });
  }
});

module.exports = FindPostOwner;
