var mongoose = require('mongoose');

var timelineSchema = mongoose.Schema({

    title        : Object,
    created_at   : { type: Date, default: Date.now },
    partnerIds   : [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    stories      : [{type: mongoose.Schema.Types.ObjectId, ref: 'Story'}]

});

module.exports = mongoose.model('Timeline', timelineSchema);
