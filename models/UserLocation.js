var mongoose = require('mongoose');
var User = mongoose.model('User');

var UserLocationSchema = new mongoose.Schema({
  longitude: String,
  latitude: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true});

// Requires population of user
UserLocationSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    longitude: String,
    latitude: String,
    createdAt: this.createdAt,
    user: this.user.toProfileJSONFor(user)
  };
};

mongoose.model('UserLocation', UserLocationSchema);
