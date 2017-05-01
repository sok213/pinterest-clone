const mongoose = require('mongoose');

let RecentImagesSchema = new mongoose.Schema({
  imageURL: {
    type: String
  },
  imageId: {
    type: String,
    required: true
  }
});

let RecentImages = mongoose.model('RecentImages', RecentImagesSchema);
module.exports = { RecentImages };
