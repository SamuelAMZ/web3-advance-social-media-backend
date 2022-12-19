const express = require("express");
const NewBookmark = express.Router();
const Bookmark = require("../../models/Bookmark");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  postId: Joi.string().max(1050).required(),
  userId: Joi.string().max(1050).required(),
});

NewBookmark.post("/", async (req, res) => {
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

  //   search for user in db
  const user = await Bookmark.findOne({ userId });
  // if not create user record and add post id
  if (!user) {
    try {
      const newBook = new Bookmark({
        userId,
        posts: [postId],
      });
      await newBook.save();

      return res.status(200).json({
        message: `success`,
        code: "ok",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `error`,
        code: "bad",
      });
    }
  }

  // if found add the post id
  if (user) {
    try {
      user.posts.push(postId);
      await user.save();

      return res.status(200).json({
        message: `success`,
        code: "ok",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `error`,
        code: "bad",
      });
    }
  }
});

module.exports = NewBookmark;
