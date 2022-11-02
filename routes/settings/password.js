const express = require("express");
const PasswordRoute = express.Router();
const User = require("../../models/UserRegister");
// hashing pass
const bcrypt = require("bcrypt");
// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  uid: Joi.string().max(255).required(),
  oldPasswordValue: Joi.string().max(255).required(),
  newPasswordValue: Joi.string().max(255).required(),
});

PasswordRoute.post("/", async (req, res) => {
  //   actual data
  const { uid, oldPasswordValue, newPasswordValue } = req.body;

  // validate data
  try {
    const validate = await schema.validateAsync({
      uid,
      oldPasswordValue,
      newPasswordValue,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   try to find user
  const idExist = await User.findById(uid);

  if (idExist === "null" || !idExist) {
    return res.status(403).json({ message: "User not valide 'code 005'" });
  }

  //   check if old is equal to actual pass
  const check = await bcrypt.compare(oldPasswordValue, idExist.password);
  if (!check)
    return res
      .status(403)
      .json({ message: "old password not match current password" });

  // hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(newPasswordValue, salt);

  // update user
  idExist.password = hashedPass;
  await idExist.save();

  res.status(200).json({
    message: "Successfully updated",
  });
});

module.exports = PasswordRoute;
