var mongoose = require('mongoose');
var User = mongoose.model('User');

var UserLocationSchema = new mongoose.Schema({
  region: {
    latitude: Number,
    longitude: Number,
    latitudeDelta: Number,
    longitudeDelta: Number,
  },
  latlang: {
    latitude: Number,
    longitude: Number,
  }
  point: {
    x: Number,
    y: Number,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true});

// Requires population of user
UserLocationSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    region: {
      latitude: this.region.latitude,
      longitude: this.region.longitude,
      latitudeDelta: this.region.latitudeDelta,
      longitudeDelta: this.region.longitudeDelta,
    },
    latlang: {
      latitude: this.region.latitude,
      longitude: this.region.longitude,
    }
    point: {
      x: this.point.x,
      y: this.point.y,
    },
    createdAt: this.createdAt,
    user: this.user.toProfileJSONFor(user)
  };
};

mongoose.model('UserLocation', UserLocationSchema);
