var mongoose = require('mongoose');

var coupleSchema = mongoose.Schema({

    names        : [String],
    partnerIds   : Object,
    stories      :
    [
      {
        title       : String,
        story       : String,
        created_at  : { type: Date, default: Date.now },
        picUrls     : [String]
      }
    ]

});

module.exports = mongoose.model('Couple', coupleSchema);
