const express = require("express");
const EmailRoute = express.Router();
const User = require("../../models/UserRegister");
// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  uid: Joi.string().max(255).required(),
  emailValue: Joi.string().max(255).required(),
});

EmailRoute.post("/", async (req, res) => {
  //   actual data
  const { uid, emailValue } = req.body;

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      uid,
      emailValue,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   try to see if email already exist and is the same as the user one
  const checkUser = await User.findOne({ email: emailValue });

  if (checkUser) {
    // check if it s the same
    if (checkUser.id === uid) {
      return res.status(400).json({ message: "can't set the same email" });
    } else {
      return res.status(400).json({ message: "email already exist" });
    }
  }

  // try to find user
  const idExist = await User.findById(uid);
  if (idExist === "null" || !idExist) {
    return res.status(403).json({ message: "User not valide 'code 005'" });
  } else {
    // update user
    idExist.email = emailValue;
    await idExist.save();

    res.status(200).json({
      message: "Successfully updated",
      user: {
        email: idExist.email,
      },
    });
  }
});

module.exports = EmailRoute;
