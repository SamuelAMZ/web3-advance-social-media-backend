const express = require("express");
const userRegisterRoute = express.Router();
const User = require("../../models/UserRegister");
// validation
const Joi = require("@hapi/joi");
// hashing pass
const bcrypt = require("bcrypt");
// jwt
const { createToken } = require("./jwt");

const schema = Joi.object({
  username: Joi.string().min(3).required(),
  name: Joi.string().min(3).required(),
  email: Joi.string().required().email().lowercase(),
  password: Joi.string().alphanum().min(6).max(1024).required(),
});

userRegisterRoute.post("/", async (req, res) => {
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync(req.body);
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  // hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  // getting actual data from body
  const user = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
  });

  try {
    // save user
    await user.save();
    // generate user token
    const token = createToken(user.id);
    // pass token to cookie
    res.cookie("uToken", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(201).json({
      message: "account created successfully",
      code: "ok",
      id: user.id,
      username: user.username,
      name: user.name,
    });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyValue.username) {
        res.status(400).json({
          message: error.keyValue.username + " already exist",
        });
      }

      if (error.keyValue.email) {
        res.status(400).json({
          message: error.keyValue.email + " already exist",
        });
      }
    } else {
      res.status(400).json({
        message: err,
      });
    }
    return;
  }
});

module.exports = userRegisterRoute;
