const express = require("express");
const ActionsRoute = express.Router();
const Posts = require("../../models/UserPosts");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  postId: Joi.string().max(1050).required(),
  userId: Joi.string().max(1050).required(),
});

ActionsRoute.post("/", async (req, res) => {
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
    // check if user like, repost, comment, bookmark
    const post = await Posts.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ message: "post not found", code: "bad", payload: "null" });
    }

    // check if user founded in likes array
    let data = {};
    const isLiked = post.likes.includes(userId);
    data = { like: isLiked };

    // send response
    return res.status(200).json({
      message: `success`,
      code: "ok",
      payload: { data },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `error finding action details for post ${postId}` });
  }
});

module.exports = ActionsRoute;
