var mongoose = require('mongoose');

var coupleSchema = mongoose.Schema({

    names        : [],
    stories      : [
      {
        title       : String,
        details     : String,
        created_at  : { type: Date, default: Date.now }
        // pictures: ???
      }
    ]

});

module.exports = mongoose.model('Couple', coupleSchema);
