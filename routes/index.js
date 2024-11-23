let express = require("express");
let passport = require("passport");

var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const users = require("./users");
const upload = require("./multer");

let localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* Login page. */
router.get("/login", function (req, res) {
  res.render("login", { error: req.flash("error") });
});

/* Profile page. */
router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("posts");
  res.render("profile", { user });
});

/* NEW Post page. */
router.get("/newpost", isLoggedIn, function (req, res) {
  res.render("newpost");
});

// feed page
router.get("/feed", function (req, res) {
  res.render("feed");
});

/* Register Page. */
router.post("/register", function (req, res) {
  let userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  });
  userModel.register(userData, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    });
});

/* file uploading */
router.post("/upload", isLoggedIn, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(404).send("No file uploaded!");
  }
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  const postCreated = await postModel.create({
    postText: req.body.postCaption,
    image: req.file.filename,
    user: user._id,
  });

  user.posts.push(postCreated._id);
  await user.save();
  res.redirect("profile");
});

// Display Image upload
router.post("/uploaded", isLoggedIn, upload.single("dpImage"), async (req, res, next) => {
  console.log(req.file);
  if (!req.file) {
      return res.status(400).send("No file uploaded");
  }
  const user = await userModel.findOne({username: req.session.passport.user})
  user.image = req.file.filename;
  await user.save();

  res.redirect("profile");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/login", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
