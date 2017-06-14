var mongoose = require('mongoose');

var SlideshowSchema = new mongoose.Schema({
  image: String,
  url: String,
  status: String
  }, {timestamps: true});

// Requires population of author
SlideshowSchema.methods.toJSONFor = function(){
  return {
    id: this._id,
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    url: this.link,
    status: this.status
  };
};

mongoose.model('Slideshow', SlideshowSchema);
