var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');

var SlideshowSchema = new mongoose.Schema({
  image: String,
  slug: String,
  url: String,
  status: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

SlideshowSchema.plugin(uniqueValidator, {message: 'is already taken'});

SlideshowSchema.pre('validate', function(next){
  this.slugify();
  next();
});

SlideshowSchema.methods.slugify = function() {
  this.slug = slug(this.image)  + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

SlideshowSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    slug: this.slug,
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    url: this.url,
    status: this.status
  };
};

// Requires population of author
SlideshowSchema.methods.toAuthFor = function(user){
  return {
    id: this._id,
    slug: this.slug,
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    url: this.url,
    status: this.status,
    created_by: this.created_by.toAuthJSON(user)
  };
};

mongoose.model('Slideshow', SlideshowSchema);
