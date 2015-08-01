var express = require('express');
var router = express.Router();
var ig = require('instagram-node').instagram();
var secrets = require('../secrets/ig-secrets.js');

var redirect_uri = 'http://localhost:3000/auth';
var access_token, currentUser;

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.status(200).send('now what');
});

router.get('/auth', function(req, res, next) {
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
      res.send('ok').status(200);
    }
  });
});

router.get('/authorize_user', function(req, res, next) {
  ig.use({ client_id: secrets.YOUR_CLIENT_ID, client_secret: secrets.YOUR_CLIENT_SECRET });
  res.redirect(ig.get_authorization_url(redirect_uri, { scope: ['likes', 'basic', 'comments', 'relationships'], state: 'a state' }));
});






module.exports = router;
