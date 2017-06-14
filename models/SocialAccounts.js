var mongoose = require('mongoose');

var SocialSchema = new mongoose.Schema({
  typeaccount: String,
  userid: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

// Requires population of user
SocialSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    typeaccount: this.type,
    userid: this.userid,
    createdAt: this.createdAt,
    user: this.user.toProfileJSONFor(user)
  };
};

mongoose.model('Social', SocialSchema);
