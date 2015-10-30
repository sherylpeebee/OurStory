var express = require('express');
var router = express.Router();
var cors = require('cors');
var path = require('path');
var mongoose = require('mongoose');
var User = require("../models/user.js");
var Timeline = require("../models/timeline.js");
var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
var EmailTemplate = require('email-templates').EmailTemplate;
var domain = process.env.NODE_ENV === "development" ?
 "http://localhost:8000/" :
 "https://the-history-of-us.herokuapp.com/";

var transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: process.env.MANDRILL_KEY
  }
}));

var templateDir = path.join(__dirname, 'BEtemplates', 'invite');
var invite = new EmailTemplate(templateDir);



router.get('/', function(req, res, next) {
  res.render('index', { title: 'The History of US'});
});

router.get('/getDomain', function(req, res, next) {
  res.send(domain);
});

router.post("/:userId/inviteFriends/:friendEmail", function(req, res, next){
  console.log(req.params.userId);
  console.log(req.params.friendEmail);
  User.findById(req.params.userId, function(err, user){
    if(err){
      console.log(err);
    }
    console.log(user);
    var invitation = {username: user.username, inviteUrl: domain + "#/acceptInvitation/" + req.params.userId};
    invite.render(invitation).then(function (results) {
      console.log(results.html);
      transport.sendMail({
        from: "noreply@the-history-of-us.com",
        to: req.params.friendEmail,
        "subject": "Come Out To Play!",
        html: results.html
      }, function(err, info) {
        if (err) {
          console.error(err);
        } else {
          console.log(info);
        }
      });
    });
  });
});


module.exports = router;
