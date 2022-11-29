const express = require("express");
const NewPostRoute = express.Router();
const Posts = require("../../models/UserPosts");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  ownerId: Joi.string().max(1024).required(),
  newPostText: Joi.string().allow("").max(1024),
  newPostImages: Joi.array().required(),
});

NewPostRoute.post("/", async (req, res) => {
  const { ownerId, newPostText, newPostImages } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      ownerId,
      newPostText,
      newPostImages,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   post
  //   creating new post
  const post = new Posts({
    ownerId: ownerId,
    postText: newPostText,
    postImages: newPostImages,
  });
  //   save
  try {
    await post.save();

    return res.status(201).json({
      message: "post created successfully",
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error when creating new post",
      code: "500",
      error,
    });
  }
});

module.exports = NewPostRoute;
