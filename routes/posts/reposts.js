const express = require("express");
const RepostsRoute = express.Router();
const Posts = require("../../models/UserPosts");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  postId: Joi.string().max(1050).required(),
  userId: Joi.string().max(1050).required(),
  repostNote: Joi.string().max(1050).allow(""),
});

RepostsRoute.post("/", async (req, res) => {
  const { postId, userId, repostNote } = req.body;

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
      repostNote,
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

    // create new post (type of repost)
    const newPost = new Posts({
      ownerId: userId,
      postText: post.postText,
      postImages: post.postImages,
      repostNote,
      originalPostId: post._id,
      originalUId: post.ownerId,
      postType: "repost",
    });
    // save repost
    await newPost.save();

    // update repost count from original user to +1
    post.reposts.push(userId);
    post.actionReposts = String(Number(post.actionReposts) + 1);
    await post.save();

    return res.status(201).json({
      message: "post created successfully",
      code: "ok",
    });
  } catch (error) {
    return res.status(500).json({ message: `error repost` });
  }
});

module.exports = RepostsRoute;
