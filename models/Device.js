var mongoose = require('mongoose');
var User = mongoose.model('User');

var DeviceSchema = new mongoose.Schema({
  body: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true});

// Requires population of user
DeviceSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    user: this.user.toProfileJSONFor(user)
  };
};

mongoose.model('Device', DeviceSchema);
