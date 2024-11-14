let express = require('express');
let passport = require('passport');

var router = express.Router();
const userModel = require("./users")
const postModel = require("./posts");
const users = require('./users');

let localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Login page. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Express' });
});

/* Profile page. */
router.get('/profile', isLoggedIn ,function(req, res) {
  res.render("profile");
})

/* Register Page. */
router.post("/register", function(req, res) {
  let userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname
  });
  userModel.register(userData, req.body.password)
  .then(function(registereduser){
    passport.authenticate("local")(req, res, function(){
      res.redirect('/profile');
    })
  })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function(req, res){}
)
router.get("/login", function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}
)

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err);}
    res.redirect('/');
  });
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/');
}


module.exports = router;
