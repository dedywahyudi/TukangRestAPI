var router = require('express').Router();
var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var User = mongoose.model('User');
var auth = require('../auth');

// param
router.param('order', function(req, res, next, slug) {
  Order.findOne({ slug: slug})
    .populate('created_by')
    .then(function(order){
      if(!order) { return res.sendStatus(404); }

      req.order = order;

      return next();
  }).catch(next);
});

// get all
router.get('/', auth.optional, function(req, res, next) {
  Promise.all([
    Order.find({ "status": "active" }).sort('createdAt'),
    Order.find({ "status": "active" }).count()
  ]).then(function(results){
    var order = results[0];
    var orderCount = results[1];

    return res.json({
      order: order.map(function(order){
        return order.toJSONFor();
      }),
      orderCount: orderCount
    });

  }).catch(next);
});

// get all inactive
router.get('/inactive', auth.optional, function(req, res, next) {
  Promise.all([
    Order.find({ $or: [ { "status": {$exists: false}}, { "status": "inactive" } ] }).sort('createdAt'),
    Order.find({ $or: [ { "status": {$exists: false}}, { "status": "inactive" } ] }).count()
  ]).then(function(results){
    var order = results[0];
    var orderCount = results[1];

    return res.json({
      order: order.map(function(order){
        return order.toJSONFor();
      }),
      orderCount: orderCount
    });

  }).catch(next);
});

// create new
router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var order = new Order(req.body.order);

    order.created_by = user;

    return order.save().then(function(){
      // console.log(order.created_by);
      return res.json({order: order.toJSONFor(user)});
    });
  }).catch(next);
});

// update
router.put('/:order', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.order.created_by._id.toString() === req.payload.id.toString()){
      if(typeof req.body.order.image !== 'undefined'){
        req.order.image = req.body.order.image;
      }

      if(typeof req.body.order.url !== 'undefined'){
        req.order.url = req.body.order.url;
      }

      if(typeof req.body.order.status !== 'undefined'){
        req.order.status = req.body.order.status;
      }

      req.order.save().then(function(order){
        return res.json({order: order.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete alias update status
router.put('/:order/delete', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.order.created_by._id.toString() === req.payload.id.toString()){

      req.order.status = "inactive";

      req.order.save().then(function(order){
        return res.json({order: order.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

module.exports = router;
