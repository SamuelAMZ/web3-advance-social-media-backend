const express = require("express");
const UsernameRoute = express.Router();
const User = require("../../models/UserRegister");
// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  uid: Joi.string().max(255).required(),
  usernameValue: Joi.string().max(255).required(),
  firstnameValue: Joi.string().max(255).allow("", null).optional(),
  lastnameValue: Joi.string().max(255).allow("", null).optional(),
  displaynameValue: Joi.string().max(255).required(),
});

UsernameRoute.post("/", async (req, res) => {
  // for CORS
  res.set({
    "Access-Control-Allow-Origin": process.env.DOMAIN,
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  });

  //   actual data
  const {
    uid,
    usernameValue,
    firstnameValue,
    lastnameValue,
    displaynameValue,
  } = req.body;

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      uid,
      usernameValue,
      firstnameValue,
      lastnameValue,
      displaynameValue,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  // try to find user
  const idExist = await User.findById(uid);
  if (idExist === "null" || !idExist) {
    return res.status(403).json({ message: "User not valide 'code 005'" });
  } else {
    // update user
    idExist.username = usernameValue;
    idExist.lastname = lastnameValue;
    idExist.firstname = firstnameValue;
    idExist.name = displaynameValue;
    await idExist.save();

    res.status(200).json({
      message: "Successfully updated",
      user: {
        username: idExist.username,
        lastname: idExist.lastname,
        firstname: idExist.firstname,
        name: idExist.name,
      },
    });
  }
});

module.exports = UsernameRoute;
