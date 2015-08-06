var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  
    id           : String,
    token        : String,
    tokenSecret  : String,
    displayName  : String,
    username     : String

});

module.exports = mongoose.model('User', userSchema);


// owner:
//    { lastName: 'sam',
//      email: 'doo@you.coo',
//      location: 'fremont ca',
//      image: 'http://boobs.com',
//      info: { pets: false, noSmoking: true },
//      startDate: '2015-07-17T07:00:00.000Z',
//      endDate: '2016-05-24T07:00:00.000Z',
//      firstName: 'sheryl' }
