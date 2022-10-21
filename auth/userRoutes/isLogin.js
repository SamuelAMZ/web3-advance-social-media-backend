const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const isLoginRoute = express.Router();
const User = require("../../models/UserRegister");

// check user token and know if it s valid token of a valid user or not
isLoginRoute.get("/", async (req, res) => {
  const uToken = req.cookies.uToken;

  if (uToken) {
    // check if token is valid
    jwt.verify(uToken, process.env.JWT_U_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.status(403).json({ message: "isNotLogin err", status: "false" });
      } else {
        // check if token uid is found in the user database
        const uId = decodedToken.id;
        const idExist = await User.findById(uId);

        if (idExist === null || !idExist) {
          res.locals.user = null;
          res.status(403).json({ message: "isNotLogin id", status: "false" });
        } else {
          // check for pages
          res.locals.user = idExist;

          res.set({
            "Access-Control-Allow-Origin": "https://tickl.ch",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
          });

          res.status(200).json({
            message: "isLogin",
            status: "true",
            user: {
              email: idExist.email,
              username: idExist.username,
              name: idExist.name,
              id: idExist.__id,
              date: idExist.date,
              lastname: idExist.lastname,
              firstname: idExist.firstname,
              desc: idExist.desc,
              website: idExist.website,
              country: idExist.country,
              gender: idExist.gender,
              bdate: idExist.bdate,
              following: idExist.following,
              followers: idExist.followers,
            },
          });
        }
      }
    });
  } else {
    res.locals.user = null;
    res.status(403).json({ message: "isNotLogin else", status: "false" });
  }
});

module.exports = isLoginRoute;
