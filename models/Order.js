var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');

// ORDER Type: On Progress - Completed
var OrderSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    merk: String,
    description: String,
    address: String,
    address_notes: String,
    order_location: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserLocation' }],
    payment: String,
    estimation: String,
    tukang: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    routes: {
      latitude: Number,
      longitude: Number,
    },
    status: String
}, {timestamps: true});

OrderSchema.methods.toJSONFor = function(order){
  return {
    category: this.category,
    id: this._id,
    merk: this.merk,
    description: this.description,
    address: this.address,
    address_notes: this.address_notes,
    order_location: this.order_location.toProfileJSONFor(order),
    payment: this.payment,
    estimation : this.status,
    tukang: this.tukang,
    routes: {
      latitude: this.routes.latitude,
      longitude: this.routes.longitude,
    },
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

mongoose.model('Order', OrderSchema);
