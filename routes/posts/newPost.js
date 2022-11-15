const express = require("express");
const NewPostRoute = express.Router();
const Posts = require("../../models/UserPosts");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  ownerId: Joi.string().max(1024).required(),
  newPostText: Joi.string().max(1024).required(),
});

NewPostRoute.post("/", async (req, res) => {
  const { ownerId, newPostText } = req.body;

  // validation
  if (!newPostText || !ownerId) {
    res.status(400).json({ message: "verify your post imput" });
    return;
  }

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      ownerId,
      newPostText,
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
