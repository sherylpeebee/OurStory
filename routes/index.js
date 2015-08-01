var express = require('express');
var router = express.Router();
var ig = require('instagram-node').instagram();
var secrets = require('../secrets/ig-secrets.js');
var cors = require('cors');

var redirect_uri = 'http://localhost:3000/auth';
var access_token, currentUser;




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // res.status(200).send('now what');
});
router.get('/poo', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.status(200).send('poo');
});

router.get('/auth', cors(), function(req, res, next) {
  console.log("LETS AUTH!!!");
  router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*, http://localhost:8080/public/layout/");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      // console.log('Yay! Access token is ' + result.access_token);
      access_token = result.access_token;
      console.log('Yay! Access token is ' + access_token);
      // console.log('The authenticated user is ' , result.user);
      currentUser = result.user;
      console.log('The authenticated user is ' , currentUser);
      //looks like:
  // { username: 'feralsheral',
  // bio: '',
  // website: '',
  // profile_picture: 'https://instagramimages-a.akamaihd.net/profiles/profile_309408871_75sq_1361853907.jpg',
  // full_name: 'Sheryl',
  // id: '309408871' }
      res.status(200);
    }
  });
});

router.get('/authorize_user', cors(), function(req, res, next) {
  router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*, http://localhost:8080/public/layout/");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  console.log("yayyyyy!!!");
  ig.use({ client_id: secrets.YOUR_CLIENT_ID, client_secret: secrets.YOUR_CLIENT_SECRET });
  res.redirect(ig.get_authorization_url(redirect_uri, { scope: ['likes', 'basic', 'comments', 'relationships']}));
});


//add "/update_userProfile" route which should include handling of adding partner, adding friends (in format of array),
//add "/new_story" which should enable adding of pics to instagram with blurbs
//is there a way to group stories in db. i.e., assign ids to each pic added and then add them to new-story id?
//each story has id and title, with multiple pics per story and one blurb per pic - - main Q is how to id//track pics to maintain story association, i guess
//add "/make_date" route that handles (and save to currentUser object in db) req.body.plan, req.body.address, req.body.date, req.body.time, req.body.partner
//will need to "inbox" partner (include email api? would that be easier? maybe not)
//add "/pending" route to see user's submitted dates and received date requests that await response






module.exports = router;
