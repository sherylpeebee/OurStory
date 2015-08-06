var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

    ig_id           : String,
    access_token    : String,
    full_name       : String,
    username        : String,
    profile_picture : String,
    incoming_requests     :
      {
        from: String, approved: Boolean
      },
        outgoing_request     :
      {
        to: String, approved: Boolean
      },
    partner      : String,
    relationship : {type: mongoose.Schema.Types.ObjectId, ref: 'Couple'}

});

module.exports = mongoose.model('User', userSchema);
