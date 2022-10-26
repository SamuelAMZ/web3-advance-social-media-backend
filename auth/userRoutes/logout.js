const express = require("express");
const LogoutRoute = express.Router();

LogoutRoute.get("/", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": process.env.DOMAIN,
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  });

  res.cookie("uToken", "", {
    maxAge: 1,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "logout successfully", code: "ok" });
});

module.exports = LogoutRoute;
