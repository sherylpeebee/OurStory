
var kittySchema = mongoose.Schema({
    name: String,
    // _id: {default: Schema.ObjectId},
    created_at: {type: Date}//, default: new Date()}
});
var Kitten = mongoose.model("Kitten", kittySchema);
  var catCount = 3;
router.get('/addKitty', function(req, res){
  catCount ++;
  var oneCat = new Kitten({name: 'kitty' + catCount});
  oneCat.save(function(err, kitten){
    if(err){
      console.log(err);
    }
    console.log('success!');
    res.send('you added' + kitten);
  });
});

router.get('/findKitty', function(req, res){
  console.log('trying to find kitties');
  // Kitten.find({_id: '55c00cffe0f7aa9354851b69'}).remove(function(err, kitty){
  //   if(err){
  //     console.log(err);
  //   }
  //   console.log(kitty);
  // });

  Kitten.find({}, null, {sort: {"_id" : -1}}, function(err, kittens){
    if(err){
       console.log(err);
     }
     console.log(kittens);
    Kitten.remove(kittens[4], function(err, removed){
      console.log(removed);
    res.status(200).send(removed);
    });
  });
  //.exec();

});



User.findOne({"username" : req.body.name}, function(err, doc){
  if(err){
    console.log(err);
  }
  if(doc){
    console.log(doc);
    // var query = { "username" : req.body.name };
    // var update = {};
    doc.incoming_requests.from = "";
    doc.incoming_requests.approved = false;
    // User.findOneandUpdate(query, req.newData, {upsert:true}, function(err, doc){
    //
    // });


    //example -- will likely need to use query chaining with .exec to find, then update just one field
//         var query = {'username':req.user.username};
// req.newData.username = req.user.username;
// MyModel.findOneAndUpdate(query, req.newData, {upsert:true}, function(err, doc){
//     if (err) return res.send(500, { error: err });
//     return res.send("succesfully saved");
// });

    res.send({found: doc.username});
  }
  else{
    res.send("invite your partner to join");
  }
});
