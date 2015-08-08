var express = require('express');
var router = express.Router();
var ig = require('instagram-node').instagram();
var secrets = require('../secrets/ig-secrets.js');
var cors = require('cors');
var mongoose = require('mongoose');
var User = require("../models/user.js");
var Couple = require("../models/couple.js");

var redirect_uri = 'http://localhost:3000/auth';
var access_token, currentUser;

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/cloudinary_cors', function(req, res, next) {
  res.render('cloudinary_cors');
});

router.get('/auth', cors(), function(req, res, next) {
  console.log("LETS AUTH!!!");
  ig.authorize_user(req.query.code, redirect_uri, function(err, result) {

    console.log('step thrrreeeee....');
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + access_token);
      currentUser = result.user;
      currentUser.access_token = access_token;
      currentUser.back = "http://localhost:3000";
      console.log('The authenticated user is ' , currentUser);
      res.send("angular.callbacks._0(" + JSON.stringify(currentUser) + ")");
    }
  });
});


router.get('/authorize_user', cors(), function(req, res, next) {

  res.set('Content-Type', 'text/html');
  console.log("STep oNNNEee!!!");
  ig.use({ client_id: secrets.YOUR_CLIENT_ID, client_secret: secrets.YOUR_CLIENT_SECRET });
  res.redirect(ig.get_authorization_url(redirect_uri, { scope: ['likes', 'basic', 'comments', 'relationships']}));
});

module.exports = router;
