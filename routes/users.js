var express = require('express');
var router = express.Router();
var cors = require('cors');
var mongoose = require('mongoose');
var User = require("../models/user.js");
var Timeline = require("../models/timeline.js");


var access_token, currentUser;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/getRequestUpdates', function(req, res, next) {
  console.log(req.body);
  var id = req.body._id;
  console.log("THE DOCUMENT YOU WERE LOKING FOR: ", id);
  User.findOne({'_id': id}, function(err, doc){
    if(err){
      console.log(err);
    }
    console.log("THE DOCUMENT YOU WERE LOOKING FOR: ", doc);
    res.send('super done');
  });
});

router.post("/createTimeline", function(req, res, next){
  console.log("working!!!1ndsjfnsdofndasojfna!!@))R($&^#*&%^&(*@^(*)))");
  console.log(req.body.newTimeline);
  var newTimeline = new Timeline(req.body.newTimeline);
  newTimeline.save(function(err, timeline){
    if(err){
      console.log(err);
    }
    else if(timeline){
      console.log(timeline);
      User.findByIdAndUpdate(req.body._id,
      {$push: {timelines: {
        id: timeline._id,
        title: timeline.title
      }}},
      {safe: true, upsert: true}, function(err, user) {
          if(err){
            console.log(err);
            return res.send(err);
          }
          User.findById(user._id, function(err, updatedUser){
            console.log(updatedUser);
            res.send(updatedUser);
          });
      });
    }
  });
});

router.post("/getTimeline", function(req, res, next){
  console.log("searching for ONE TIMELINE!!");
  var id = req.body.id;
  Timeline.findById(id, function(err, doc){
    if(err){
      console.log(err);
      return;
    }
  res.send(doc);
  });
});

router.post('/updatePartner', function(req, res, next) {
  var id = req.body._id;
  User.findOneAndUpdate({"_id": id}, req.body, function(err, doc){
    if(err){
      console.log(err);
      res.send();
    }
    console.log("SAVED DOCCCCCC!!!!: ", doc);
    doc.incoming_requests.forEach(function(request){
      if(request.approved === true){
        User.findOne({"username" : request.from}).lean().exec(function(err, person){
          console.log("PERSONNNNNUHhhH!!: ", person);
          var couple = new Couple({
            names : [doc.full_name || doc.username, person.full_name || person.username],
            partnerIds : {
              one: doc._id, imgOne: doc.profile_picture,
              two: person._id, imgTwo: person.profile_picture
            },
          });
          couple.save(function(err, couple){
            if(err){
              console.log(err);
              res.send();
            }
            console.log("COUPLEUPPPLEUPPPPPLELELELEDDCUPZZZZZZ: ", couple);
            doc.relationships.push(couple._id);
            doc.save(function(err, savedOne){
              if(err){
                console.log(err);
                res.send();
              }
              console.log("FIRST SAVED MEMBER HEEEERRREEUHHUH$$#$#$#!", savedOne);
            });
            console.log("LINE 49 -- DOES THIS PERSON EXIST???!!!! SANITY CHECK HEEEERRREEUHHUH$$#$#$#!", person);
            User.findOne({"username" : person.username}, function(err, member2){
              member2.relationships.push(couple._id);
              member2.save(function(err, savedTwo){
                console.log("SEGUNDOOOOO SAVED MEMBER HEEEERRREEUHHUH$$#$#$#!", savedTwo);
              });
            });
          });
              res.send('done');
              console.log(doc);
        });
      }
      else{
        console.log("no dice");
      }
    });

  });
});
// Item.find({}).populate('comments.created_by').exec(function(err, items) {
//     console.log(items[0].comments[0].created_by.name);
// });


router.post('/findUser', cors(), function(req, res, next) {
  console.log("find User request body: ", req.body);
  User.findOne({ 'oauth_id': req.body }).populate('timelines').exec(function(err, doc){
      if(err){
        console.log(err);
      }
      if(!doc){
        console.log("nothing here!");
        res.status(200).send({doc: undefined});
      }
      else{
      console.log("doc: ", doc);
      res.status(200).send(doc);
      }
  });
});

router.post('/fetchUpdatedTimelines', cors(), function(req, res, next) {
  console.log("get updated timelines request body: ", req.body);
  User.findOne({ 'oauth_id': req.body.oauth_id }).populate("timelines").exec(function(err, doc){
      if(err){
        console.log(err);
      }
      console.log("doc: ", doc);
      res.status(200).send(doc);
  });
});

router.post('/createOrUpdateAccount', cors(), function(req, res, next) {
  console.log("request body: ", req.body);
  console.log("request body: ", req.body.oauth_id);
  var loginMethod = Object.keys(req.body.oauth_id)[0];
  // var query = {};
  // query[loginMethod] =  req.body.oauth_id[loginMethod];
  // console.log("query: ", query);
  var id = req.body.oauth_id[loginMethod];
  switch (loginMethod) {
    case "twitter":
    User.findOne({'oauth_id.twitter': id}, function(err, doc){
      if(err){
        console.log(err);
      }
      else if(doc) {
        console.log(doc);
        doc.full_name = req.body.full_name;
        doc.save(function(err, updatedUser){
          if(err){
            console.log(err);
          }
          console.log('you just changed the user full_name.');
          res.send(updatedUser);
        });
        // res.send(doc);
      }
      else if (!doc){
          var newUser = new User({
            oauth_id : req.body.oauth_id,
            access_token : req.body.access_token,
            full_name : req.body.full_name,
            username : req.body.username,
            profile_picture : req.body.profile_picture,
            // outgoing_request : {
            //   to : req.body.partner.name,
            //   approved: false
            // }
          });
          newUser.save(function(err, user){
            if(err){
              console.log(err);
            }
            console.log('success!');
            res.send(user);
          });
      }
    });
      break;
    case "google":
    User.findOne({'oauth_id.google': id}, function(err, doc){
      if(err){
        console.log(err);
      }
      else if(doc) {
        console.log(doc);
        res.send(doc);
      }
      else if (!doc){
          var newUser = new User({
            oauth_id : req.body.oauth_id,
            access_token : req.body.access_token,
            full_name : req.body.full_name,
            username : req.body.username,
            profile_picture : req.body.profile_picture,
            // outgoing_request : {
            //   to : req.body.partner.name,
            //   approved: false
            // }
          });
          newUser.save(function(err, user){
            if(err){
              console.log(err);
            }
            console.log('success!');
            res.send(user);
          });
      }
    });
      break;
    default:

  }
});

router.post("/findFriend", function(req, res){
  console.log("friend search: ", req.body);
  // var searchTerm = req.body.search === "username" ? "username" : "full_name";
  // console.log("searchTerm: ", searchTerm + typeof searchTerm);
  switch(req.body.search) {
    case "username":
    User.findOne({"username" : req.body.name}, function(err, doc){
      if(err){
        console.log(err);
      }
      if(doc){
        console.log(doc);
        doc.incoming_requests.push({
          from : req.body.from,
          approved : false,
          timeline: {
            id: req.body.timeline.id,
            title: req.body.timeline.title
          }
        });
        doc.save(function(err, updatedDoc){
          if(err){
            console.log(err);
          }
          console.log(updatedDoc);
          res.send({sentTo: updatedDoc.username});
        });
      }
      else{
        res.send("We couldn't find " + req.body.name + ". " + "But you can invite them to join!");
      }
    });
        break;
    case "full_name":
    User.findOne({"full_name" : req.body.name}, function(err, doc){
      if(err){
        console.log(err);
      }
      if(doc){
        console.log(doc);
        doc.incoming_requests.push({
          from : req.body.from,
          approved : false,
          timeline: {
            id: req.body.timeline.id,
            title: req.body.timeline.title
          }
        });
        doc.save(function(err, updatedDoc){
          if(err){
            console.log(err);
          }
          console.log(updatedDoc);
          res.send({sentTo: updatedDoc.full_name});
        });
      }
      else{
        res.send("We couldn't find " + req.body.name + ". " + "But you can invite them to join!");
      }
    });
        break;
  }
});


module.exports = router;
