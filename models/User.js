var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var UserLocation = mongoose.model('UserLocation');
var Device = mongoose.model('Device');
var Skill = mongoose.model('Skill');
var SocialAccounts = mongoose.model('SocialAccounts');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  fullname: {
    type: String,
    required: [true, "can't be blank"],
  },
  role: String,
  thumbnail: String,
  phone: String,
  linkedAccounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SocialAccounts' }],
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }],
  userlocation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserLocation' }],
  payment: {
    type: String,
  },
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
  skills: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Skill'
  },
  rating: number,
  validated: boolean,
  status: String,
  hash: String,
  salt: String
}, {
  timestamps: true
});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    fullname: this.fullname,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserSchema.methods.toAuthJSON = function(){
  return {
    fullname: this.fullname,
    email: this.email,
    token: this.generateJWT()
  };
};

UserSchema.methods.toProfileJSONFor = function(user){
  return {
    email: this.email,
    fullname: this.fullname,
    role: this.fullname,
    thumbnail: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    phone: this.phone,
    linkedAccounts: this.linkedAccounts.toProfileJSONFor(user),
    devices: this.devices.toProfileJSONFor(user),
    userlocation: this.userlocation.toProfileJSONFor(user),
    payment: this.payment.type,
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
    skills: this.skills.toProfileJSONFor(user),
    rating: this.rating,
    validated: this.validated,
    status: this.status,
  };
};

mongoose.model('User', UserSchema);
