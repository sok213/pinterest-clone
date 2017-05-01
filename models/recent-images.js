const mongoose = require('mongoose');

let RecentImagesSchema = new mongoose.Schema({
  imageURL: {
    type: String
  }
});

let RecentImages = mongoose.model('RecentImages', RecentImagesSchema);
module.exports = { RecentImages };
