var mongoose = require('mongoose');

var SlideshowSchema = new mongoose.Schema({
  image: String,
  link: String,
  }, {timestamps: true});

// Requires population of author
SlideshowSchema.methods.toJSONFor = function(){
  return {
    id: this._id,
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    link: this.link,
  };
};

mongoose.model('Slideshow', SlideshowSchema);
