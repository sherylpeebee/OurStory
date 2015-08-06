
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
