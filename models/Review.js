var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');

var ReviewSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  star: Number,
  comments: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true});

// Requires population of author
ReviewSchema.methods.toJSONFor = function(user, order){
  return {
    id: this._id,
    order: this.order.toProfileJSONFor(order),
    comments: this.body,
    createdAt: this.createdAt,
    user: this.user.toProfileJSONFor(user),
  };
};

mongoose.model('Comment', ReviewSchema);
