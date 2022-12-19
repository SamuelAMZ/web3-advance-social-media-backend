const express = require("express");
const SingleBookmark = express.Router();
const Posts = require("../../models/UserPosts");
const User = require("../../models/UserRegister");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  postId: Joi.string().max(1050).required(),
});

SingleBookmark.post("/", async (req, res) => {
  const { postId } = req.body;

  if (postId === "") {
    return res
      .status(400)
      .json({ message: "nothing", code: "bad", payload: "null" });
  }

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      postId,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  // search for post
  const post = await Posts.findOne({ _id: postId });
  // if no post send 400
  if (!post) {
    return res.status(400).json({
      message: `post not found`,
      code: "bad",
      payload: "nothing",
    });
  }
  // if found get post owner
  if (post) {
    // serach for post owner
    const owner = await User.findOne({ _id: post.ownerId });
    if (!owner) {
      return res.status(400).json({
        message: `post owner not found`,
        code: "bad",
        payload: "nothing",
      });
    }

    // send res
    return res.status(200).json({
      message: `success`,
      code: "ok",
      payload: { postInfo: post, ownerInfo: owner },
    });
  }

  // else something wrong
  return res.status(500).json({
    message: `something went wrong`,
    code: "bad",
  });
});

module.exports = SingleBookmark;
