const express = require("express");
const DescirptionRoute = express.Router();
const User = require("../../models/UserRegister");
// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  uid: Joi.string().max(255).required(),
  bioValue: Joi.string().max(1024).allow("", null).optional(),
  websiteValue: Joi.string().max(255).allow("", null).optional(),
});

DescirptionRoute.post("/", async (req, res) => {
  // for CORS
  res.set({
    "Access-Control-Allow-Origin": process.env.DOMAIN,
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  });

  //   actual data
  const { uid, bioValue, websiteValue } = req.body;

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      uid,
      bioValue,
      websiteValue,
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
    idExist.desc = bioValue;
    idExist.website = websiteValue;
    await idExist.save();

    res.status(200).json({
      message: "Successfully updated",
      user: {
        desc: idExist.desc,
        website: idExist.website,
      },
    });
  }
});

module.exports = DescirptionRoute;
