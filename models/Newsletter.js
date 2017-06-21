var mongoose = require('mongoose');
var User = mongoose.model('User');

var NewsletterSchema = new mongoose.Schema({
  service_activities: Boolean,
  service_promo: Boolean,
  special_promo: Boolean
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

// Requires population of user
NewsletterSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    service_activities: this.service_activities,
    service_promo: this.service_promo,
    special_promo: this.special_promo,
    user: this.user.toProfileJSONFor(user)
  };
};

mongoose.model('Newsletter', NewsletterSchema);
