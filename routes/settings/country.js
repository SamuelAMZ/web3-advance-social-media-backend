const express = require("express");
const CountryRoute = express.Router();
const User = require("../../models/UserRegister");
// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  uid: Joi.string().max(255).required(),
  countryValue: Joi.string().max(50).required(),
});

CountryRoute.post("/", async (req, res) => {
  //   actual data
  const { uid, countryValue } = req.body;

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      uid,
      countryValue,
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
    idExist.country = countryValue;
    await idExist.save();

    res.status(200).json({
      message: "Successfully updated",
      user: {
        birthdate: idExist.country,
      },
    });
  }
});

module.exports = CountryRoute;
