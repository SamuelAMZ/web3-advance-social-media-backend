// getting single user data
const express = require("express");
const FindUser = express.Router();
const User = require("../../models/UserRegister");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  uid: Joi.string().max(255).required(),
});

FindUser.post("/", async (req, res) => {
  const { uid } = req.body;

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      uid,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   find user
  try {
    const userData = await User.findById(uid);
    return res.json({
      message: "user fetched",
      status: "ok",
      user: userData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error finding post owner id ${ownerId}` });
  }
});

module.exports = FindUser;
