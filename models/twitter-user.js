const mongoose = require('mongoose');

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
