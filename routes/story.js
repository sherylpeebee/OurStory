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
  res.send('respond with a resource');
});

router.post('/createCouple', function(req, res, next) {
  console.log(req.body.names);
  var members = req.body.names.split(',');
  var couple = new Couple({names: members});
  couple.save(function(err, newCouple){
    if(err){
      console.log(err);
    }
    console.log("saved: ", newCouple);
  });
});


module.exports = router;
