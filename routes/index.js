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

// var picSchema = mongoose.Schema({
//     uri: String
// });
// var Pic = mongoose.model("Pic", picSchema);

/* GET home page. */
router.post('/pic', function(req, res, next) {
  console.log('delivering a pic');
  var img = req.body.img;
  var newPic = new Pic({uri: img});
  newPic.save(function(err, pic){
    if(err){
      console.log(err);
    }
    console.log('success!');
    // res.send('you added' + pic);
  res.status(200).send(pic);
  });

});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // res.status(200).send('now what');
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

router.post('/userData', cors(), function(req, res, next) {
  console.log("request body: ", req.body);

  User.find({ 'ig_id': req.body.id }, function (err, docs) {
    if(err){
      console.log(err);
    }
    if(!docs[0]){
      console.log("nothing here!");
      res.status(200).send(null);
    }
    else{
    console.log("docs: ", docs);
    res.status(200).send("ok");
    }
  });
});
//
// { full_name: 'susan sarandon',
//   partner: { name: 'feralsheral', search: 'username' },
//   username: 'sherpeebee',
//   profile_picture: 'https://instagramimages-a.akamaihd.net/profiles/profile_173576403_75sq_1337832370.jpg',
//   ig_id: '173576403',
//   access_token: '173576403.1d87646.4719ebb953924fbbb9cf961bf45fa5c2' }
// var userSchema = mongoose.Schema({
//
//     ig_id           : String,
//     access_token    : String,
//     display_name    : String,
//     full_name       : String,
//     username        : String,
//     profilePic      : String,
//     incoming_requests     :
//       {
//         from: String, approved: Boolean
//       },
//     outgoing_requests     :
//       {
//         to: String, approved: Boolean
//       },
//     partner      : String,
//     relationship : {type: mongoose.Schema.Types.ObjectId, ref: 'Couple'}
//
// });
router.post('/updateUser', cors(), function(req, res, next) {
  console.log("request body: ", req.body);

  var updatedUser = new User({
    ig_id : req.body.ig_id,
    access_token : req.body.access_token,
    full_name : req.body.full_name,
    username : req.body.username,
    profile_picture : req.body.profile_picture,
    outgoing_request : {
      from : req.body.partner,
      approved: false
    }
  });

  updatedUser.save(function(err, user){
    if(err){
      console.log(err);
    }
    console.log('success!');
    res.send('you added' + user);
  });
  res.send('ok');
   
});

//after registration, if user returns, on view/edit profile

//add "/update_userProfile" route which should include handling of adding partner, adding friends (in format of array),
//add "/new_story" which should enable adding of pics to instagram with blurbs
//is there a way to group stories in db. i.e., assign ids to each pic added and then add them to new-story id?
//each story has id and title, with multiple pics per story and one blurb per pic - - main Q is how to id//track pics to maintain story association, i guess
//add "/make_date" route that handles (and save to currentUser object in db) req.body.plan, req.body.address, req.body.date, req.body.time, req.body.partner
//will need to "inbox" partner (include email api? would that be easier? maybe not)
//add "/pending" route to see user's submitted dates and received date requests that await response




module.exports = router;
