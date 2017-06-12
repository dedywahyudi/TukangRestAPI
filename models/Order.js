var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');
var Category = mongoose.model('Category');
var Comment = mongoose.model('Comment');
var UserLocation = mongoose.model('UserLocation');

// ORDER Type: On Progress - Completed
var OrderSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    merk: String,
    description: String
    address: String,
    addressnotes: String,
    orderLocation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserLocation' }],
    payment: String,
    estimation: String,
    tukang: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    routes: {
      latitude: Number,
      longitude: Number,
    }
    status: String,
}, {timestamps: true});

OrderSchema.methods.toJSONFor = function(order){
  return {
    category: this.category,
    id: this._id,
    merk: this.merk,
    description: this.description,
    address: this.address,
    addressnotes: this.addressnotes,
    userlocation: this.userlocation.toProfileJSONFor(order),
    payment: this.payment,
    estimation : this.status,
    tukang: this.tukang,
    routes: {
      latitude: this.routes.latitude,
      longitude: this.routes.longitude,
    }
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

mongoose.model('Order', OrderSchema);
