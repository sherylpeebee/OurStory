var mongoose = require('mongoose');

var storySchema = mongoose.schema =

  {
    title       : String,
    author      : Object,
    story       : String,
    created_at  : { type: Date, default: Date.now },
    pics        : []
  };

  module.exports = mongoose.model("Story", storySchema);
