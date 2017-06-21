var mongoose = require('mongoose');
var User = mongoose.model('User');

var PaymentSchema = new mongoose.Schema({
  type : String,
  amount: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

// Requires population of user
PaymentSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    type: this.type,
    amount: this.amount,
    user: this.user.toProfileJSONFor(user)
  };
};

mongoose.model('Payment', PaymentSchema);
