var mongoose = require('mongoose');
var Order = mongoose.model('Order');

var OrderLocationSchema = new mongoose.Schema({
  longitude: String,
  latitude: String,
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
}, {timestamps: true});

// Requires population of user
OrderLocationSchema.methods.toJSONFor = function(order){
  return {
    id: this._id,
    longitude: String,
    latitude: String,
    createdAt: this.createdAt,
    order: this.order.toProfileJSONFor(order)
  };
};

mongoose.model('OrderLocation', OrderLocationSchema);
