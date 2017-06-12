var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');

// ORDER Type: On Progress - Completed
var OrderSchema = new mongoose.Schema({
    category: String,
    merk: String,
    description: String,
    notes: String,
    address: String,
    addresspin: String,
    payment: String,
    status: String,
    estimation: String,
    routes: String,
    tukang: {
      name: String,
      phone: String,
      thumbnail: String,
    },
    region: {
      latitude: Number,
      longitude: Number,
      latitudeDelta: Number,
      longitudeDelta: Number,
    }
}, {timestamps: true});

OrderSchema.plugin(uniqueValidator, {message: 'is already taken'});

OrderSchema.pre('validate', function(next){
  this.slugify();

  next();
});

OrderSchema.methods.slugify = function() {
  this.slug = slug(this.title);
};

OrderSchema.methods.updateFavoriteCount = function() {
  var article = this;

  return User.count({favorites: {$in: [article._id]}}).then(function(count){
    article.favoritesCount = count;

    return article.save();
  });
};

OrderSchema.methods.toJSONFor = function(user){
  return {
    category: String,
    id: this._id,
    merk: this.merk,
    description: this.description,
    address: this.address,
    addresspin: this.address,
    notes: this.notes,
    payment: this.payment,
    status: this.status,
    estimation    : this.status,
    routes: this.status,
    tukang: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

mongoose.model('Order', OrderSchema);
