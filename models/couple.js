var mongoose = require('mongoose');

var coupleSchema = mongoose.Schema({

    names        : [String],
    partnerIds   : Object,
    stories      : [{type: mongoose.Schema.Types.ObjectId, ref: 'Story'}]

});

module.exports = mongoose.model('Couple', coupleSchema);
