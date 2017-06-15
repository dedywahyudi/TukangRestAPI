var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
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
  full_name: String,
  username: {
    type: String,
    lowercase: true,
    unique: true
  },
  role: String,
  thumbnail: String,
  phone: String,
  linked_accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SocialAccounts' }],
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }],
  user_location: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserLocation' }],
  payment: {
    type: String,
    amount: String,
  },
  newsletter: {
    email: String,
    service_activities: Boolean,
    service_promo: Boolean,
    special_promo: Boolean
  },
  push_notification: {
    account_activities: Boolean,
    service_promo: Boolean,
    special_promo: Boolean
  },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  rating: Number,
  validated: Boolean,
  status: String,
  hash: String,
  salt: String
}, {
  timestamps: true
});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.pre('validate', function(next){
  this.slugify();

  next();
});

UserSchema.methods.slugify = function() {
  this.username = slug(this.full_name);
};

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
    email: this.email,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserSchema.methods.toAuthJSON = function(){
  return {
    id: this._id,
    email: this.email,
    full_name: this.full_name,
    username: this.username,
    role: this.role,
    thumbnail: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    token: this.generateJWT()
  };
};

UserSchema.methods.toProfileJSONFor = function(user){
  return {
    id: this._id,
    email: this.email,
    full_name: this.full_name,
    username: this.username,
    role: this.role,
    thumbnail: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    phone: this.phone,
    linked_accounts: this.linked_accounts.toProfileJSONFor(user),
    devices: this.devices.toProfileJSONFor(user),
    user_location: this.user_location.toProfileJSONFor(user),
    payment: this.payment.type,
    // newsletter: {
    //   email: this.newsletter.email,
    //   service_activities: this.newsletter.service_activities,
    //   service_promo: this.newsletter.service_promo,
    //   special_promo: this.newsletter.special_promo,
    // },
    // push_notification: {
    //   account_activities: this.push_notification.account_activities,
    //   service_promo: this.push_notification.service_promo,
    //   special_promo: this.push_notification.special_promo,
    // },
    skills: this.skills.toProfileJSONFor(user),
    rating: this.rating,
    validated: this.validated,
    status: this.status
  };
};

mongoose.model('User', UserSchema);
