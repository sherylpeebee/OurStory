var express = require('express');
var router = express.Router();
var ig = require('instagram-node').instagram();
var cors = require('cors');
var mongoose = require('mongoose');
var User = require("../models/user.js");
var Couple = require("../models/couple.js");
var passport = require('passport');
var InstagramStrategy = require("passport-instagram").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
       done(err, user);
   });
});

passport.use(new InstagramStrategy({
    clientID: process.env.YOUR_CLIENT_ID,
    clientSecret: process.env.YOUR_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/instagram/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      User.findOne({ 'ig_id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser = new User();

                    // set all of the user data that we need
                    newUser.ig_id    = profile.id;
                    newUser.access_token = profile.token;
                    newUser.full_name  = profile.full_name;
                    newUser.username = profile.username;

                    // save our user into the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        res.send("angular.callbacks._0(" + JSON.stringify(newUser) + ")");
                        return done(null, newUser);
                    });
                }
            });
    });
  }
));

// var redirect_uri = 'https://the-history-of-us.herokuapp.com/auth';
// var redirect_uri = 'http://localhost:8000/auth';
var access_token, currentUser;

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res, next) {
  console.log("LETS AUTH!!!");
  res.redirect('/');

  // ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
  //
  //   console.log('step thrrreeeee....');
  //   if (err) {
  //     console.log(err.body);
  //     res.send("Didn't work");
  //   } else {
  //     console.log('Yay! Access token is ' + access_token);
  //     currentUser = result.user;
  //     currentUser.access_token = access_token;
  //     // currentUser.back = "https://the-history-of-us.com";
  //     console.log('The authenticated user is ' , currentUser);
  //     res.send("angular.callbacks._0(" + JSON.stringify(currentUser) + ")");
  //   }
  // });
});


router.get('/auth/instagram', passport.authenticate('instagram'), function(req, res, next) {

});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
