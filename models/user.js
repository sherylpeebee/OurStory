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
        from: String, approved: Boolean, reviewed: Boolean, timeline: {id: {type: mongoose.Schema.Types.ObjectId, ref: 'Timeline'}, title: String}
      }],
    outgoing_requests     :
      [{
        to: String, approved: Boolean, reviewed: Boolean
      }],
    timelines : [{title: String, id: {type: mongoose.Schema.Types.ObjectId, ref: 'Timeline'}}]

});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
