var mongoose = require('mongoose');
var slug = require('slug');

var CategorySchema = new mongoose.Schema({
slug: {
  type: String,
  lowercase: true,
  unique: true
},
  title: String,
  icon: String
}, {timestamps: true});

CategorySchema.pre('validate', function(next){
  this.slugify();
  next();
});

CategorySchema.methods.slugify = function() {
  this.slug = slug(this.title);
};

CategorySchema.methods.toJSONFor = function(){
  return {
    slug: this.slug,
    title: this.title,
    icon: this.icon
  };
};

mongoose.model('Category', CategorySchema);
