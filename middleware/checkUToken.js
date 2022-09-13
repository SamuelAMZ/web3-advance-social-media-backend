require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/UserRegister");

// check user token and know if it s valid token of a valid user or not
const checkUToken = (req, res) => {
  const uToken = req.cookies.uToken;

  if (uToken) {
    // check if token is valid
    jwt.verify(uToken, process.env.JWT_U_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.status(403).json({ message: "isNotLogin err" });
      } else {
        // check if token uid is found in the user database
        const uId = decodedToken.id;
        const idExist = await User.findById(uId);

        if (idExist === null || !idExist) {
          res.locals.user = null;
          res.status(403).json({ message: "isNotLogin id" });
        } else {
          // check for pages
          res.locals.user = idExist;
          res.status(200).json({ message: "isLogin" });
        }
      }
    });
  } else {
    res.locals.user = null;
    res.status(403).json({ message: "isNotLogin else" });
  }
};

module.exports = { checkUToken };
