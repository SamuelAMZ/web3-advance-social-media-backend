const express = require("express");
const BookmarksList = express.Router();
const Bookmark = require("../../models/Bookmark");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  userId: Joi.string().max(1050).required(),
});

BookmarksList.post("/", async (req, res) => {
  const { userId } = req.body;

  if (userId === "") {
    return res
      .status(400)
      .json({ message: "nothing", code: "bad", payload: "null" });
  }

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      userId,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  // search for user in db
  const bookmarks = await Bookmark.findOne({ userId });

  // if not found send 200 no bookmark
  if (!bookmarks) {
    return res.status(200).json({
      message: `success`,
      code: "ok",
      payload: [],
    });
  }
  // if found send 200 with post ids
  if (bookmarks) {
    return res.status(200).json({
      message: `success`,
      code: "ok",
      payload: bookmarks.posts.reverse(),
    });
  }

  // else
  return res.status(500).json({
    message: `something went wrong`,
    code: "bad",
  });
});

module.exports = BookmarksList;
