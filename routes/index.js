var express = require('express');
var router = express.Router();
var cors = require('cors');
var path = require('path');
var mongoose = require('mongoose');
var User = require("../models/user.js");
var Timeline = require("../models/timeline.js");
// var mandrill = require('mandrill-api/mandrill');
// var mandrill_client = new mandrill.Mandrill('LxAdks7StHa7cxs5fZgkVQ');
var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
var EmailTemplate = require('email-templates').EmailTemplate;

var transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: 'LxAdks7StHa7cxs5fZgkVQ'
  }
}));

var templateDir = path.join(__dirname, 'BEtemplates', 'invite');
var invite = new EmailTemplate(templateDir);



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

});

router.post("/:userId/inviteFriends/:friendEmail", function(req, res, next){
  console.log(req.params.userId);
  console.log(req.params.friendEmail);
  User.findById(req.params.userId, function(err, user){
    if(err){
      console.log(err);
    }
    console.log(user);
    var invitation = {username: user.username, inviteUrl: "http://localhost:8000/#/acceptInvitation/" + req.params.userId};
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

// router.get("//the-history-of-us.herokuapp.com/acceptInvitation/:invitationId", function(req, res, next){
// router.get("http://localhost:8000/acceptInvitation/:invitationId", function(req, res, next){
//   res.redirect("http://localhost:8000/acceptInvitation/:invitationId");
// });

module.exports = router;
