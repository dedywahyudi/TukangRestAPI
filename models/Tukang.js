var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var Location = mongoose.model('Location');
var Device = mongoose.model('Device');
var Skill = mongoose.model('Skill');
var secret = require('../config').secret;

var TukangSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "can't be blank"],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  phone: String,
  thumbnail: String,
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }],
  location: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skills' }],
  newsletter: {
    email: String,
    serviceactivities: boolean,
    servicepromo: boolean,
    specialpromo: boolean,
  },
  pushnotification: {
    accountactivities: boolean,
    servicepromo: boolean,
    specialpromo: boolean,
  },
  hash: String,
  salt: String
}, {
  timestamps: true
});

TukangSchema.plugin(uniqueValidator, {message: 'is already taken.'});

TukangSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

TukangSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

TukangSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    fullname: this.fullname,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

TukangSchema.methods.toAuthJSON = function(){
  return {
    fullname: this.fullname,
    email: this.email,
    token: this.generateJWT()
  };
};

TukangSchema.methods.toProfileJSONFor = function(user){
  return {
    fullname: this.fullname,
    phone: this.phone,
    thumbnail: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    phone: this.phone,
    thumbnail: this.thumbnail,
    newsletter: {
      email: email.newsletter.email,
      serviceactivities: email.newsletter.serviceactivities,
      servicepromo: email.newsletter.servicepromo,
      specialpromo: email.newsletter.specialpromo,
    },
    pushnotification: {
      accountactivities: email.pushnotification.accountactivities,
      servicepromo: email.pushnotification.servicepromo,
      specialpromo: email.pushnotification.specialpromo,
    },
  };
};

mongoose.model('Tukang', TukangSchema);
