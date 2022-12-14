const express = require("express");
const userLoginRoute = express.Router();
const User = require("../../models/UserRegister");
// validation
const Joi = require("@hapi/joi");
// dehashing pass
const bcrypt = require("bcrypt");
// jwt
const { createToken } = require("./jwt");

const schema = Joi.object({
  emailOrUsername: Joi.string().lowercase().required(),
  password: Joi.string().max(1024).required(),
});

userLoginRoute.post("/", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      emailOrUsername,
      password,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  // validation
  if (!emailOrUsername || !password) {
    res.status(400).json({ message: "verify your inputs" });
    return;
  }

  // push data to it if username or email found
  const verifier = [];
  let userFound;

  // check for the email address in the db
  const checkUser = await User.findOne({ email: emailOrUsername });
  if (checkUser) {
    verifier.push(1);
    userFound = checkUser;
  }

  // check for the username in the db
  const checkUsername = await User.findOne({ username: emailOrUsername });
  if (checkUsername) {
    verifier.push(1);
    userFound = checkUsername;
  }

  if (verifier.length === 0) {
    res.status(400).json({ message: "email or username not found" });
    return;
  } else {
    // dehash pass and try to match them
    if (await bcrypt.compare(password, userFound.password)) {
      // generate user token
      const token = createToken(userFound.id);
      // pass token to cookie
      res.cookie("uToken", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).json({
        message: "login successfully",
        code: "ok",
        id: userFound.id,
        name: userFound.name,
      });
    } else {
      res.status(400).json({ message: "verify username, email or password" });
      return;
    }
  }
});

module.exports = userLoginRoute;
