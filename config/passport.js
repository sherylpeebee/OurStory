//
// var InstagramStrategy = require('passport-instagram').Strategy;
// var passport_ig = require("passport-instagram");
// var User = require("../models/user.js");
//
// module.exports = function(passport_ig) {
//
//     // used to serialize the user for the session
//     passport_ig.serializeUser(function(user, done) {
//         done(null, user.id);
//     });
//
//     // used to deserialize the user
//     passport_ig.deserializeUser(function(id, done) {
//         User.findById(id, function(err, user) {
//             done(err, user);
//         });
//     });
//
//     passport_ig.use(new FacebookStrategy({
//       clientID: process.env.YOUR_CLIENT_ID,
//       clientSecret: process.env.YOUR_CLIENT_SECRET,
//       callbackURL: "http://localhost:8000/auth/instagram/callback"
//
//     },
//
//     // facebook will send back the token and profile
//     function(token, refreshToken, profile, done) {
//
//         // asynchronous
//         process.nextTick(function() {
//
//             // find the user in the database based on their facebook id
//             User.findOne({ 'ig_id' : profile.id }, function(err, user) {
//
//                 if (err)
//                     return done(err);
//
//                 if (user) {
//                     return done(null, user);
//                 } else {
//
//                     var newUser = new User();
//
//
//                     newUser.ig_id    = profile.id;
//                     newUser.access_token = token;
//                     newUser.full_name  = profile.full_name;
//                     newUser.username = profile.username;
//
//                     newUser.save(function(err) {
//                         if (err)
//                             throw err;
//
//                         // if successful, return the new user
//                         return done(null, newUser);
//                     });
//                 }
//
//             });
//         });
//
//     }));
//
// }();
