const express = require("express");
const LogoutRoute = express.Router();

LogoutRoute.get("/", (req, res) => {
  res.cookie("uToken", "", { maxAge: 1 });
  res.status(200).json({ message: "logout successfully", code: "ok" });
});

module.exports = LogoutRoute;
