const express = require("express");
const UnLikesRoute = express.Router();
const Posts = require("../../models/UserPosts");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  postId: Joi.string().max(1050).required(),
  userId: Joi.string().max(1050).required(),
});

UnLikesRoute.post("/", async (req, res) => {
  const { postId, userId } = req.body;

  if (postId === "" || userId === "") {
    return res
      .status(400)
      .json({ message: "nothing", code: "bad", payload: "null" });
  }

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      postId,
      userId,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   find post
  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ message: "post not found", code: "bad", payload: "null" });
    }

    // add userid to array
    post.likes.pull(userId);
    post.actionLikes = String(Number(post.actionLikes) - 1);
    await post.save();

    // get new likes array length
    sizeArr = post.actionLikes;

    // send response
    return res.status(200).json({
      message: `success`,
      code: "ok",
      payload: { likesSize: sizeArr },
    });
  } catch (error) {
    return res.status(500).json({ message: `error unliking post` });
  }
});

module.exports = UnLikesRoute;
