const express = require("express");
const ProfilemgRoute = express.Router();
const User = require("../../models/UserRegister");
// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  uid: Joi.string().max(255).required(),
  imageType: Joi.string().max(20).required(),
  imageUri: Joi.string().max(255).required(),
  imageUriSmall: Joi.string().max(255).required(),
});

ProfilemgRoute.post("/", async (req, res) => {
  // for CORS
  res.set({
    "Access-Control-Allow-Origin": process.env.DOMAIN,
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  });

  //   actual data
  const { uid, imageType, imageUri, imageUriSmall } = req.body;

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      uid,
      imageType,
      imageUri,
      imageUriSmall,
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
    if (imageType === "icon") {
      // update user
      idExist.profileicon.thumb = imageUriSmall;
      idExist.profileicon.normal = imageUri;
      await idExist.save();

      return res.status(200).json({
        message: "Successfully updated",
        user: {
          email: idExist.email,
          username: idExist.username,
          name: idExist.name,
          id: idExist._id,
          date: idExist.date,
          lastname: idExist.lastname,
          firstname: idExist.firstname,
          desc: idExist.desc,
          website: idExist.website,
          country: idExist.country,
          gender: idExist.gender,
          bdate: idExist.bdate,
          following: idExist.following,
          followers: idExist.followers,
          profileicon: {
            normal: idExist.profileicon.normal,
            thumb: idExist.profileicon.thumb,
          },
          profileback: {
            normal: idExist.profileback.normal,
          },
        },
      });
    }

    if (imageType === "back")
      // update user
      idExist.profileback.normal = imageUri;
    await idExist.save();

    return res.status(200).json({
      message: "Successfully updated",
      user: {
        email: idExist.email,
        username: idExist.username,
        name: idExist.name,
        id: idExist._id,
        date: idExist.date,
        lastname: idExist.lastname,
        firstname: idExist.firstname,
        desc: idExist.desc,
        website: idExist.website,
        country: idExist.country,
        gender: idExist.gender,
        bdate: idExist.bdate,
        following: idExist.following,
        followers: idExist.followers,
        profileicon: {
          normal: idExist.profileicon.normal,
          thumb: idExist.profileicon.thumb,
        },
        profileback: {
          normal: idExist.profileback.normal,
        },
      },
    });
  }
});

module.exports = ProfilemgRoute;
