var express = require('express');
var router = express.Router();
var ig = require('instagram-node').instagram();
var secrets = require('../secrets/ig-secrets.js');
var cors = require('cors');
var mongoose = require('mongoose');
var fs = require('fs');
var cloudinary = require("cloudinary");
var User = require("../models/user.js");
var Couple = require("../models/couple.js");
var CLOUD_API_SECRET = require("../secrets/cloudinary-api-secret.js");

var redirect_uri = 'http://localhost:3000/auth';
var access_token, currentUser;

cloudinary.config({
  cloud_name: 'our-story',
  api_key: '811217315275282',
  // "timestamp":  Date.now(),
  api_secret: CLOUD_API_SECRET
});

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

router.post('/pic', function(req, res, next) {
  console.log('delivering a pic');
  var img = req.body.img;
  var base64 = img.replace(/^data:image\/(png|jpg|jpeg);base64,/, "") ;

  //store at this point in mongo for backup here; on read out, will need to prepend string with jpg, jpeg, png, etc.

  var buf = new Buffer(base64, 'base64');
  console.log(buf);

  fs.writeFile('output.jpg', buf, 'binary', function(err, data){
    if (err) {
     return console.log(err);
   }
   console.log(data);
   res.status(200).send('ok');
  });

});

router.get("/secret", function(req, res){
  res.json(CLOUD_API_SECRET);
});

router.get("/cloudinary_response", function(req, res){
  console.log(req);
  res.send('ok');
});

module.exports = router;
