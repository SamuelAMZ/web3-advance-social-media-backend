const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// User routes
const userRegisterRoute = require("./auth/userRoutes/register.js");
const userLoginRoute = require("./auth/userRoutes/login.js");
const userIsLoginRoute = require("./auth/userRoutes/isLogin");
const UsernameRoute = require("./routes/settings/username");
const ProfileImgRoute = require("./routes/settings/profileimg");
// middlewares
const checkUToken = require("./middleware/checkUToken");

// body parsing
app.use(express.json());
// cookies
app.use(cookieParser());
// cors
app.use(
  cors({
    origin: process.env.DOMAIN,
    credentials: true,
    optionSuccessStatus: 200,
  })
);

// connect mongoose
mongoose.connect(process.env.DB_URI_USR, {}, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to db");
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Server up");
});

/*   
    @desc: register user
    @method: POST
    @privacy: public
    @endpoint: /api/user/register
    @body: {name: "name", email: "email", password: "password"}
*/
app.use("/twitter/api/user/register", userRegisterRoute);

/*   
    @desc: login user
    @method: POST
    @privacy: public
    @endpoint: /api/user/login
    @body: {email: "email", password: "password"}
*/
app.use("/twitter/api/user/login", userLoginRoute);

/*   
    @desc: check user is login
    @method: GET
    @privacy: public
    @endpoint: /twitter/api/user/checkLogin
*/
app.use("/twitter/api/user/islogin", userIsLoginRoute);

/*   
    @desc: update username setting fields
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/settings/username
*/
app.use("/twitter/api/settings/username", checkUToken, UsernameRoute);

/*   
    @desc: update profile picture setting fields
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/settings/profileimg
*/
app.use("/twitter/api/settings/profileimg", checkUToken, ProfileImgRoute);

app.listen(process.env.PORT, () =>
  console.log(`app listen on port ${process.env.PORT}`)
);
