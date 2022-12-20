const express = require("express");
const NewComment = express.Router();
const Comment = require("../../models/Comments");
const Posts = require("../../models/UserPosts");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  postId: Joi.string().max(1050).required(),
  userId: Joi.string().max(1050).required(),
  commentText: Joi.string().max(1050).allow(""),
  commentImages: Joi.array().required(),
});

NewComment.post("/", async (req, res) => {
  const { postId, userId, commentText, commentImages } = req.body;

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
      commentText,
      commentImages,
    });
  } catch (error) {
    console.log(error.details);
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  // search for post
  const post = await Posts.findOne({ _id: postId });
  // check if post exist or not
  if (!post) {
    return res.status(400).json({
      message: `post not found`,
      code: "bad",
    });
  }
  // create comment
  try {
    const newComment = new Comment({
      userId,
      postId,
      commentText,
      commentImages,
    });
    await newComment.save();

    // add comment id to post comments array
    post.comments.push(newComment._id);
    // update comment count
    post.actionComments = String(Number(post.actionComments) + 1);
    await post.save();

    return res.status(200).json({
      message: `success`,
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `error creating comment`,
      code: "bad",
    });
  }
});

module.exports = NewComment;
