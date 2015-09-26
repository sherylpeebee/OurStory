var mongoose = require('mongoose');

var timelineSchema = mongoose.Schema({

    title        : Object,
    // names        : [String],
    created_at   : { type: Date, default: Date.now },
    // partnerIds   : [Object],
    partnerIds   : [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    stories      : [{type: mongoose.Schema.Types.ObjectId, ref: 'Story'}]

});

module.exports = mongoose.model('Timeline', timelineSchema);
