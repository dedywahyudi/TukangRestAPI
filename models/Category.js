var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');

var CategorySchema = new mongoose.Schema({
slug: {
  type: String,
  lowercase: true,
  unique: true,
  index: true
},
  title: String,
  icon: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

CategorySchema.plugin(uniqueValidator, {message: 'is already taken'});

CategorySchema.pre('validate', function(next){
  this.slugify();
  next();
});

CategorySchema.methods.slugify = function() {
  this.slug = slug(this.title);
};

CategorySchema.methods.toAuthJSON = function(user){
  return {
    id: this._id,
    slug: this.slug,
    title: this.title,
    icon: this.icon,
    created_by: this.created_by.toAuthJSON(user)
  };
};

CategorySchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    slug: this.slug,
    title: this.title,
    icon: this.icon
  };
};

mongoose.model('Category', CategorySchema);
