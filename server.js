const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// User routes
const userRegisterRoute = require("./auth/userRoutes/register.js");
const userLoginRoute = require("./auth/userRoutes/login.js");

// middlewares
// check valid user token (login or not)
const { checkUToken } = require("./middleware/checkUToken");

// body parsing
app.use(express.json());
// cookies
app.use(cookieParser());
// cors
app.use(
  cors({
    origin: "*",
    credentials: true,
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

app.get("/twitter/api/user/checkLogin", checkUToken);

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

app.listen(process.env.PORT, () =>
  console.log(`app listen on port ${process.env.PORT}`)
);
