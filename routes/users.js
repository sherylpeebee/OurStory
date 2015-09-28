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


router.post("/createTimeline", function(req, res, next){
  console.log(req.body);
  var newTimeline = new Timeline({title: req.body.newTimeline.title});
  newTimeline.save(function(err, timeline){
    if(err){
      console.log(err);
    }
    console.log("NEW TIMELINE: ", timeline);
    var newTimelineInfo = {
      title: timeline.title,
      id: timeline._id,
      badgeStyle: req.body.newTimeline.badgeStyle
    };
    User.findById(req.body._id, function(err, user) {
      if(err){
        console.log(err);
        return res.send(err);
      }
      user.timelines.push(newTimelineInfo);
      user.save(function(err, updatedUser){
        if(err){
          console.log(err);
        }
        console.log("USER WITH NEW TIMELINE: ", updatedUser);
        res.send(updatedUser);
      });
    });
  });
});

router.post("/getTimeline", function(req, res, next){
  console.log("searching for ONE TIMELINE!!");
  var id = req.body.id;
  Timeline.findById(id).populate("stories").exec(function(err, timeline){
    if(err){
      console.log(err);
    }
    res.send(timeline);
  });
});

router.post('/reviewTimelineInvitations', function(req, res, next) {
  var id = req.body._id;
  var requests = req.body.incoming_requests;
  console.log("trying to update a partner: ", requests);
  console.log("full request body: ", req.body);
  for(var i = 0; i < requests.length; i++){
    if(requests[i].approved === true){
      var newTimelineInfo = {
        title: requests[i].timeline.title,
        id: requests[i]._id,
        badgeStyle: requests[i].badgeStyle
      };
    }
    if(requests[i].reviewed === true){
      requests.splice(i, 1);
    }
  }

  User.findById({"_id": id}, function(err, doc){
    if(err){
      console.log(err);
      res.send();
    }
    doc.timelines.push(newTimelineInfo);
    doc.incoming_requests = requests;
    doc.save(function(err, docWithUpdates){
      if(err){
        console.log(err);
      }
      console.log(docWithUpdates);
      res.send(docWithUpdates);
    });

  });

  // req.body.incoming_requests = requests;
  // console.log("after reviewed are spliced out:", req.body.incoming_requests);
  // User.findOneAndUpdate({"_id": id}, req.body, function(err, doc){
  //   if(err){
  //     console.log(err);
  //     res.send();
  //   }
  //
  //
  // });
  res.send();
});
// Item.find({}).populate('comments.created_by').exec(function(err, items) {
//     console.log(items[0].comments[0].created_by.name);
// });//this is just an example for my own reference

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
        console.log("FOUND YOUR FRIEND!!: ", doc);
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
          console.log("UPDATES TO FRIEND!!: ", updatedDoc);
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
