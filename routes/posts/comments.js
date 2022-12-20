const express = require("express");
const CommentList = express.Router();
const Posts = require("../../models/UserPosts");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  postId: Joi.string().max(1050).required(),
});

CommentList.post("/", async (req, res) => {
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

  // search for user in db
  const post = await Posts.findOne({ _id: postId });

  // if not found send 200 no bookmark
  if (!post) {
    return res.status(200).json({
      message: `error post not found`,
      code: "bad",
    });
  }
  // if found send 200 with post ids
  if (post) {
    return res.status(200).json({
      message: `success`,
      code: "ok",
      payload: post.comments.reverse(),
    });
  }

  // else
  return res.status(500).json({
    message: `something went wrong`,
    code: "bad",
  });
});

module.exports = CommentList;
