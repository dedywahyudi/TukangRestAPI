var mongoose = require('mongoose');
var User = mongoose.model('User');

var SlideshowSchema = new mongoose.Schema({
  image: String,
  url: String,
  status: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

SlideshowSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    url: this.url,
    status: this.status
  };
};

// Requires population of author
SlideshowSchema.methods.toAuthFor = function(user){
  return {
    id: this._id,
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    url: this.url,
    status: this.status,
    created_by: this.created_by.toProfileJSONFor(user)
  };
};

mongoose.model('Slideshow', SlideshowSchema);
