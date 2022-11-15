const express = require("express");
const HomePostsRoute = express.Router();
const Posts = require("../../models/UserPosts");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  paged: Joi.number().required(),
});

HomePostsRoute.post("/", async (req, res) => {
  const { paged } = req.body;
  const steps = 10;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      paged,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   load posts
  try {
    const homePosts = await Posts.find()
      .limit(10 * paged)
      .sort({ date: -1 })
      .exec();

    return res.json({
      message: "posts fetched",
      code: "ok",
      data: homePosts,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error loading posts", code: "500" });
  }
});

module.exports = HomePostsRoute;
