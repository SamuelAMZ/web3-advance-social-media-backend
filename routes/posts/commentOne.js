const express = require("express");
const CommentOne = express.Router();
const User = require("../../models/UserRegister");
const Comment = require("../../models/Comments");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  commentId: Joi.string().required(),
});

CommentOne.post("/", async (req, res) => {
  const { commentId } = req.body;

  //   validation
  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      commentId,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  try {
    // then search for all of the array elements
    const comment = await Comment.find({ _id: commentId });
    const finalArr = [];

    // search for user
    const owner = await User.findOne({ _id: comment[0].userId });

    if (owner) {
      // send
      return res.status(200).json({
        message: "comments found",
        code: "ok",
        payload: {
          comment: comment[0],
          owner: owner,
        },
      });
    } else {
      return res.status(400).json({
        message: `comment owner not found ${comment.userId} from comment ${comment}`,
        code: "bad",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `something went wrong`,
      code: "bad",
    });
  }
});

module.exports = CommentOne;
