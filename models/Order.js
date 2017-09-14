var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');
var Category = mongoose.model('Category');

var OrderSchema = new mongoose.Schema({
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    index: true
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  merk: String,
  deskripsi: String,
  alamat: String,
  notes: String,
  latitude: String,
  longitude: String,
  latitudeDelta: String,
  longitudeDelta: String,
  status: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

OrderSchema.plugin(uniqueValidator, {message: 'is already taken'});

OrderSchema.pre('validate', function(next){
  this.slugify();
  next();
});

OrderSchema.methods.slugify = function() {
  this.slug = slug(this.merk)  + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

// Requires population of author
OrderSchema.methods.toAuthFor = function(user){
  return {
    category: this.category.toAuthJSON(user),
    id: this._id,
    slug: this.slug,
    merk: this.merk,
    deskripsi: this.deskripsi,
    alamat: this.alamat,
    notes: this.notes,
    latitude: this.latitude,
    longitude: this.longitude,
    latitudeDelta: this.latitudeDelta,
    longitudeDelta: this.longitudeDelta,
    status: this.status,
    created_by: this.created_by.toAuthJSON(user)
  };
};

mongoose.model('Order', OrderSchema);
