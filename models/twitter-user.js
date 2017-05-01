const mongoose = require('mongoose'),
_              = require('lodash');

let TwitterUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    unique: true
  },
  twitterId: {
    type: String,
    required: true,
    unique: true
  },
  images: {
    type: Array
  }
});

// Override the toJSON default method to only send back the user id and email
// when a user object is converted back to a JSON value.
TwitterUserSchema.methods.toJSON = function() {
  let user = this,
  userObject = this.toObject();
  
  return _.pick(userObject, 
    [
      '_id', 
      'email',
      'username',
      'images'
    ]);
};

TwitterUserSchema.statics.findOrCreate = function(user, callback) {
  let TwitterUser = this;
  let twitterId = user.id;
  TwitterUser.find({twitterId: twitterId}, callback);
};

TwitterUserSchema.statics.getUserById = function(id, callback) {
  let User = this;
  User.findById(id, callback);
};

let TwitterUser = mongoose.model('TwitterUser', TwitterUserSchema);

module.exports = { TwitterUser };
