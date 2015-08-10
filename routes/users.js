var express = require('express');
var router = express.Router();
var ig = require('instagram-node').instagram();
var secrets = require('../secrets/ig-secrets.js');
var cors = require('cors');
var mongoose = require('mongoose');
var User = require("../models/user.js");
var Couple = require("../models/couple.js");


var access_token, currentUser;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/updatePartner', function(req, res, next) {
  console.log(req.body);
  var id = req.body._id;
  User.findOneAndUpdate({"_id": id}, req.body, function(err, doc){
    if(err){
      console.log(err);
    }

    doc.incoming_requests.forEach(function(request){
      if(request.approved === true){
        User.find({"username" : request.from}, function(err, person){
          console.log("person: ", person);
          var couple = new Couple({
            names : [doc.full_name || doc.username, person.full_name || person.username],
            partnerIds : {
              one: doc._id,
              two: person._id
            },
          });
          couple.save(function(err, couple){
            if(err){
              console.log(err);
            }
            doc.relationships.push(couple._id);
            person.relationships.push(couple._id);
            console.log(couple);
          });
        });
      }
      else{
        console.log("no dice");
      }
    });
    console.log(doc);
  });
  res.send('done');
});

router.post('/findUser', cors(), function(req, res, next) {
  console.log("find User request body: ", req.body.id);

  User.find({ 'ig_id': req.body.id }, function (err, docs) {
    if(err){
      console.log(err);
    }
    if(!docs[0]){
      console.log("nothing here!");
      res.status(200).send("nothing here!");
    }
    else{
    console.log("docs: ", docs);
    res.status(200).send(docs[0]);
    }
  });
});

router.post('/updateUser', cors(), function(req, res, next) {
  console.log("request body: ", req.body);
  var updatedUser = new User({
    ig_id : req.body.ig_id,
    access_token : req.body.access_token,
    full_name : req.body.full_name,
    username : req.body.username,
    profile_picture : req.body.profile_picture,
    outgoing_request : {
      to : req.body.partner.name,
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
});

router.post("/findPartner", function(req, res){
  console.log("partner search: ", req.body);
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
        approved : false
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
        res.send("invite your partner to join");
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
        approved : false
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
        res.send("invite your partner to join");
      }
    });
        break;
  }
});


//add "/update_userProfile" route which should include handling of adding partner, adding friends (in format of array),
//add "/new_story" which should enable adding of pics to instagram with blurbs
//is there a way to group stories in db. i.e., assign ids to each pic added and then add them to new-story id?
//each story has id and title, with multiple pics per story and one blurb per pic - - main Q is how to id//track pics to maintain story association, i guess
//add "/make_date" route that handles (and save to currentUser object in db) req.body.plan, req.body.address, req.body.date, req.body.time, req.body.partner
//will need to "inbox" partner (include email api? would that be easier? maybe not)
//add "/pending" route to see user's submitted dates and received date requests that await response




module.exports = router;
