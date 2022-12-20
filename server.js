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
const LogoutRoute = require("./auth/userRoutes/logout");
const UserDataRoute = require("./routes/user/userData");
const FollowRoute = require("./routes/user/follow");
const UnFollowRoute = require("./routes/user/unFollow");
const FollowList = require("./routes/user/followList");
const FindUser = require("./routes/user/singleUser");
const WhoToFollow = require("./routes/user/whoToFollow");
const Suggetions = require("./routes/user/suggetions");
// settings route
const UsernameRoute = require("./routes/settings/username");
const ProfileImgRoute = require("./routes/settings/profileimg");
const DescirptionRoute = require("./routes/settings/description");
const EmailRoute = require("./routes/settings/email");
const CountryRoute = require("./routes/settings/country");
const BirthdateRoute = require("./routes/settings/birthdate");
const GenderRoute = require("./routes/settings/gender");
const PasswordRoute = require("./routes/settings/password");
// searching routes
const SearchDataroute = require("./routes/user/searchData");
// posts routes
const NewPostRoute = require("./routes/posts/newPost");
const SinglePost = require("./routes/posts/singlePost");
const HomePostsRoute = require("./routes/posts/homePosts");
const FindPostOwner = require("./routes/posts/postOwner");
const ActionsRoute = require("./routes/posts/actions.js");
const LikesRoute = require("./routes/posts/likes");
const UnLikesRoute = require("./routes/posts/unlikes");
const RepostsRoute = require("./routes/posts/reposts");
const NewBookmark = require("./routes/posts/bookmarkNew");
const BookmarksList = require("./routes/posts/bookmarks");
const SingleBookmark = require("./routes/posts/bookmarkSingle");
const NewComment = require("./routes/posts/commentNew");
const CommentList = require("./routes/posts/comments");
const CommentOne = require("./routes/posts/commentOne");
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
mongoose.connect(process.env.DB_URI_USR, { maxPoolSize: 10 }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to db");
  }
});

// set headers globally
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": process.env.DOMAIN,
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  });
  next();
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
    @desc: logout user
    @method: GET
    @privacy: public
    @endpoint: /api/user/logout
*/
app.use("/twitter/api/user/logout", LogoutRoute);

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

/*   
    @desc: update description and website setting fields
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/settings/description
*/
app.use("/twitter/api/settings/description", checkUToken, DescirptionRoute);

/*   
    @desc: update email and website setting fields
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/settings/email
*/
app.use("/twitter/api/settings/email", checkUToken, EmailRoute);

/*   
    @desc: update country setting fields
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/settings/country
*/
app.use("/twitter/api/settings/country", checkUToken, CountryRoute);

/*   
    @desc: update birthdate setting fields
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/settings/birthdate
*/
app.use("/twitter/api/settings/birthdate", checkUToken, BirthdateRoute);

/*   
    @desc: update gender setting fields
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/settings/gender
*/
app.use("/twitter/api/settings/gender", checkUToken, GenderRoute);

/*   
    @desc: update password setting fields
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/settings/password
*/
app.use("/twitter/api/settings/password", checkUToken, PasswordRoute);

/*   
    @desc: getting target user data for profile
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/user/userdata
*/
app.use("/twitter/api/user/userdata", checkUToken, UserDataRoute);

/*   
    @desc: searching user names and names
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/user/searchpeople
*/
app.use("/twitter/api/user/searchpeople", checkUToken, SearchDataroute);

/*   
    @desc: adding new post 
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/post/newpost
*/
app.use("/twitter/api/post/newpost", checkUToken, NewPostRoute);

/*   
    @desc: fetching posts 
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/post/homeposts
*/
app.use("/twitter/api/post/homeposts", checkUToken, HomePostsRoute);

/*   
    @desc: fetching posts 
    @method: POST
    @privacy: public
    @endpoint: /twitter/api/post/findpostowner
*/
app.use("/twitter/api/post/findpostowner", FindPostOwner);

/*   
    @desc: following route
    @method: POST
    @privacy: public
    @endpoint: /twitter/api/user/follow
*/
app.use("/twitter/api/user/follow", FollowRoute);

/*   
    @desc: unfollowing route
    @method: POST
    @privacy: public
    @endpoint: /twitter/api/user/unfollow
*/
app.use("/twitter/api/user/unfollow", UnFollowRoute);

/*   
    @desc: followlist route
    @method: POST
    @privacy: public
    @endpoint: /twitter/api/user/followlist
*/
app.use("/twitter/api/user/followlist", FollowList);

/*   
    @desc: find single user for following ... route
    @method: POST
    @privacy: public
    @endpoint: /twitter/api/user/followlist
*/
app.use("/twitter/api/user/singleuser", FindUser);

/*   
    @desc: find 3 random user for who to follow route
    @method: GET
    @privacy: public
    @endpoint: /twitter/api/user/whotofollow
*/
app.use("/twitter/api/user/whotofollow", WhoToFollow);

/*   
    @desc: find 10 random user for who to follow route
    @method: GET
    @privacy: public
    @endpoint: /twitter/api/user/suggetions
*/
app.use("/twitter/api/user/suggetions", Suggetions);

/*   
    @desc: find action details
    @method: POST
    @privacy: public
    @endpoint: /twitter/api/post/actions
*/
app.use("/twitter/api/post/actions", ActionsRoute);

/*   
    @desc: like post
    @method: POST
    @privacy: public
    @endpoint: /twitter/api/post/likes
*/
app.use("/twitter/api/post/likes", LikesRoute);

/*   
    @desc: unlike post
    @method: POST
    @privacy: public
    @endpoint: /twitter/api/post/unlikes
*/
app.use("/twitter/api/post/unlikes", UnLikesRoute);

/*   
    @desc: adding repost 
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/post/repost
*/
app.use("/twitter/api/post/repost", checkUToken, RepostsRoute);

/*   
    @desc: new bookmark
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/post/newbookmark
*/
app.use("/twitter/api/post/newbookmark", checkUToken, NewBookmark);

/*   
    @desc: bookmarks list
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/post/bookmarklist
*/
app.use("/twitter/api/post/bookmarklist", checkUToken, BookmarksList);

/*   
    @desc: bookmarks list
    @method: POST
    @privacy: public
    @endpoint: /twitter/api/post/singlebookmark
*/
app.use("/twitter/api/post/singlebookmark", SingleBookmark);

/*   
    @desc: single post
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/post/singlepost
*/
app.use("/twitter/api/post/singlepost", checkUToken, SinglePost);

/*   
    @desc: new comment
    @method: POST
    @privacy: private
    @endpoint: /twitter/api/post/newcomment
*/
app.use("/twitter/api/post/newcomment", checkUToken, NewComment);
/*   
    @desc: comments ids
    @method: POST
    @privacy: public
    @endpoint: /twitter/api/post/commentslist
*/
app.use("/twitter/api/post/commentslist", CommentList);

/*   
    @desc: single comment
    @method: POST
    @privacy: public
    @endpoint: /twitter/api/post/onecomment
*/
app.use("/twitter/api/post/onecomment", CommentOne);

app.listen(process.env.PORT, () =>
  console.log(`app listen on port ${process.env.PORT}`)
);
