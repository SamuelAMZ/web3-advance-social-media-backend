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
      .skip(paged)
      .limit(8)
      .sort({ date: -1 })
      .exec();

    // mix it with ads
    const adsArr = [
      {
        name: "pickering",
        id: 1,
        img: "/img/pickering.jpg",
        url: "http://www.pickeringangels.com/",
        ad: "true",
      },
      {
        name: "lavilla",
        id: 2,
        img: "/img/oshawa.jpg",
        url: "http://lavillaspa.ca/",
        ad: "true",
      },
      {
        name: "caries vip",
        id: 3,
        img: "/img/carries.jpg",
        url: "https://carriesvip.ca/",
        ad: "true",
      },
    ];
    let finalArr = [];

    const getRandomAd = () => {
      let random = Math.floor(Math.random() * adsArr.length);
      if (random > adsArr.length) {
        random = 0;
      }

      return random;
    };

    for (let i = 0; i < homePosts.length; i++) {
      if (i > 2 && i % 3 === 0) {
        finalArr.push(adsArr[getRandomAd()]);
      }

      finalArr.push(homePosts[i]);
    }

    // if load the last post
    if (homePosts.length === 0) {
      return res.json({
        message: "posts fetched",
        code: "ok",
        more: "no",
        data: finalArr,
        // data: homePosts,
      });
    }

    // if remain posts
    return res.json({
      message: "posts fetched",
      code: "ok",
      more: "yes",
      data: finalArr,
      // data: homePosts,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error loading posts", code: "500" });
  }
});

module.exports = HomePostsRoute;
