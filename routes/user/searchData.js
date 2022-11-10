const express = require("express");
const SearchDataroute = express.Router();
const User = require("../../models/UserRegister");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  urlData: Joi.string().max(1050).required(),
});

SearchDataroute.post("/", async (req, res) => {
  const { urlData } = req.body;

  if ((urlData === "", urlData === null)) {
    return res
      .status(400)
      .json({ message: "nothing", status: "false", user: "null" });
  }

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      urlData,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   find users
  try {
    const names = await User.find({
      tags: { $regex: urlData, $options: "i" },
    }).exec();

    return res.json({ message: "users fetched", status: "true", data: names });
  } catch (error) {
    return res.status(500).json({ message: "error finding users" });
  }
});

module.exports = SearchDataroute;
