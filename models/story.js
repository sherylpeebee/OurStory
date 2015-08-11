var mongoose = require('mongoose');

var storySchema = mongoose.schema =


  {
    title       : String,
    story       : String,
    created_at  : { type: Date, default: Date.now },
    pics        : [String]
    //{url:  someUri, caption: someJunk}
  };

  module.exports = mongoose.model("Story", storySchema);
