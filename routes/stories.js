var express = require('express');
var router = express.Router();
var ig = require('instagram-node').instagram();
// var secrets = require('../secrets/ig-secrets.js');
var cors = require('cors');
var mongoose = require('mongoose');
var fs = require('fs');
var User = require("../models/user.js");
var Timeline = require("../models/timeline.js");
var Story = require("../models/story.js");
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// cloudinary.uploader.upload("output.jpg", function(result) { console.log(result); });

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

var importPics;
var searchParams = /^http:\/\/|^https:\/\//i;
router.post("/addStory", function(req, res){
  var imgObjArray, bufferedImgsObj, storyObj = {
    title: req.body.title,
    author: req.body.author,
    story: req.body.summary,
    created_at: req.body.date
  },
  timeline_id = req.body.timeline_id;
  if(req.body.image){
    importPics = function(loader){
      imgObjArray = req.body.image;
      var base64ImgObjArray = imgObjArray.map(function(imgObj){//<-- these are to be objects with 'url' and 'title' attributes
          //  if(imgObj.url.search(searchParams) === -1){
             imgObj.url = imgObj.url.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
             return imgObj;
          //  }
          //  else {
          //   var urlToBase64 = new Buffer(imgObj.url).toString('base64');
          //   imgObj.url = urlToBase64;
          //   return imgObj;
          //  }
      });

      bufferedImgsObj = base64ImgObjArray.map(function(base64Obj){
        // if(base64Obj.url.search(searchParams) === -1){
          var buf = new Buffer(base64Obj.url, 'base64');
          base64Obj.url = buf;
          return base64Obj;
        // }
        // else {
          // return base64Obj;
        // }//log these out to see the contents of "bufferedImgsObj" should be full objects
         //with urls replaced with converted strings if they were base64Imgs before
      });

      bufferedImgsObj.forEach(function(bufferedObj){
        fs.writeFile(bufferedObj.title + '.jpg', bufferedObj.url, 'binary', function(err, data){
          if (err) {
            console.log(err);
          }
        });
      });
      loader(makeStory);
    };
    var upload = function (storyFunc){
    var picArray = [];
      bufferedImgsObj.forEach(function(bufferedObj){
        cloudinary.uploader.upload(bufferedObj.title + '.jpg', function(result) {
          picArray.push({
            url: result.url,
            caption: result.original_filename
          });
          picCheck(picArray);
        });
      });
      function picCheck(picArray){
        if(picArray.length === bufferedImgsObj.length){
          storyFunc(picArray);
        }
        else{
          picCheck(picArray);
        }
      }
    };
    var makeStory = function(arr){
      storyObj.pics = arr;
      console.log("~~~STORY OBJ!!!~~~: ", storyObj);
      var newStory = new Story(storyObj);
      newStory.save(function(err, story){
        if(err){
          console.log(err);
        }
        console.log(story);
        Timeline.findOne({_id: timeline_id}, function(err, doc){
          if(err){
            console.log(err);
          }
          console.log(story);
          console.log(story._id);
          console.log("WE FOUND YOUR TIMELINE!!: ", doc);
          doc.stories.push(story._id);
          doc.save(function(err, updatedTimeline){
            if(err){
              console.log(err);
            }
            Timeline.findById(updatedTimeline._id).populate("stories").exec(function(err, docWithStories){
              if(err){
                console.log(err);
              }
              res.status(200).send(docWithStories);
            });
          });
        });
      });
    };
    importPics(upload);
  }
});
    // // var base64 = img.replace(/^data:image\/(png|jpg|jpeg);base64,/, "") ;
    // // var buf = new Buffer(base64, 'base64');
    // //
    // // console.log(buf);
    //
    // fs.writeFile('output.jpg', buf, 'binary', function(err, data){
    //  if (err) {
    //    return console.log(err);
    //  }
    //  console.log(data);
    //  res.status(200).send('ok');
    // });
  // else{
  //   res.status(200).send('no images sent');
  //   // res.status(200).send('test');
  //   return;
  // }
  // // var images = req.body.img;
  // // var newStory = new Story({
  // //   title: req.body.title,
  // //   story: req.body.summary,
  // //   created_at: req.body.date,
  // //   // pics: req.body.img
  // // });
  // // newStory.save(function(err, story){
  // //   //pics not saving here;
  // //   if(err){
  // //     console.log(err);
  // //   }
  // //   console.log(story);
  // //   console.log(story._id);
  // //   Story.findOneAndUpdate({"_id": story._id}, {pics: images}, {upsert: true}, function(err, affecred, raw){
  // //     if(err){
  // //       console.log(err);
  // //     }
  // //     res.send('done');
  // //   });
  // // });
// });



module.exports = router;
