var mongoose = require('mongoose');
var User = mongoose.model('User');

var PushNotificationSchema = new mongoose.Schema({
  account_activities: Boolean,
  service_promo: Boolean,
  special_promo: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

// Requires population of user
PushNotificationSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    account_activities: this.account_activities,
    service_promo: this.service_promo,
    special_promo: this.special_promo,
    user: this.user.toProfileJSONFor(user)
  };
};

mongoose.model('PushNotification', PushNotificationSchema);
