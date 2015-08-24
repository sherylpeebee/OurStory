var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var userSchema = mongoose.Schema({

    oauth_id        : Object,
    access_token    : String,
    full_name       : String,
    username        : String,
    profile_picture : String,
    incoming_requests     :
      [{
        from: String, approved: Boolean, reviewed: Boolean
      }],
    outgoing_requests     :
      [{
        to: String, approved: Boolean, reviewed: Boolean
      }],

    // partner       : String,
    // relationships : [{type: mongoose.Schema.Types.ObjectId, ref: 'Couple'}],
    timelines : [{type: mongoose.Schema.Types.ObjectId, ref: 'Timeline'}]

});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
