var express = require('express');
var router = express.Router();
var ig = require('instagram-node').instagram();
var cors = require('cors');
var mongoose = require('mongoose');
var User = require("../models/user.js");
var Timeline = require("../models/timeline.js");
var passport = require('passport');
var InstagramStrategy = require("passport-instagram").Strategy;
var access_token, currentUser;

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
