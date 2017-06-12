var mongoose = require('mongoose');
var User = mongoose.model('User');

var CategorySchema = new mongoose.Schema({
slug: {
  type: String,
  lowercase: true,
  unique: true
},
  title: String,
  icon: String,
}, {timestamps: true});

CategorySchema.methods.toJSONFor = function(){
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    icon: this.icon,
  };
};

mongoose.model('Category', CategorySchema);
