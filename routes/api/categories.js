var router = require('express').Router();
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var User = mongoose.model('User');
var auth = require('../auth');

// param
router.param('category', function(req, res, next, slug) {
  Category.findOne({ slug: slug})
    .populate('created_by')
    .then(function (category) {
      if (!category) { return res.sendStatus(404); }

      req.category = category;

      return next();
  }).catch(next);
});

// param
router.param('categoryid', function(req, res, next, id) {
  Category.findById(id)
    .populate('created_by')
    .then(function (category) {
      if (!category) { return res.sendStatus(404); }

      req.category = category;

      return next();
  }).catch(next);
});


// get all
router.get('/', auth.optional, function(req, res, next) {
  Promise.all([
    Category.find({ "status": "active" }).sort('title'),
    Category.find({ "status": "active" }).count()
  ]).then(function(results){
    var category = results[0];
    var categoryCount = results[1];

    return res.json({
      category: category.map(function(category){
        return category.toJSONFor();
      }),
      categoryCount: categoryCount
    });

  }).catch(next);
});

// get all inactive
router.get('/inactive', auth.optional, function(req, res, next) {
  Promise.all([
    Category.find({ $or: [ { "status": {$exists: false}}, { "status": "inactive" } ] }).sort('createdAt'),
    Category.find({ $or: [ { "status": {$exists: false}}, { "status": "inactive" } ] }).count()
  ]).then(function(results){
    var category = results[0];
    var categoryCount = results[1];

    return res.json({
      category: category.map(function(category){
        return category.toJSONFor();
      }),
      categoryCount: categoryCount
    });

  }).catch(next);
});


// create new
router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var category = new Category(req.body.category);

    category.created_by = user;

    return category.save().then(function(){
      console.log(category.created_by);
      return res.json({category: category.toJSONFor(user)});
    });
  }).catch(next);
});

// return a category
router.get('/:category', auth.optional, function(req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.category.populate('created_by').execPopulate()
  ]).then(function(results){
    var user = results[0];

    return res.json({category: req.category.toAuthJSON(user)});
  }).catch(next);
});

// return a category by id
router.get(':categoryid/categoryid', auth.optional, function(req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.category.populate('created_by').execPopulate()
  ]).then(function(results){
    var user = results[0];

    return res.json({category: req.category.toAuthJSON(user)});
  }).catch(next);
});

// update
router.put('/:category', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.category.created_by._id.toString() === req.payload.id.toString()){
      if(typeof req.body.category.title !== 'undefined'){
        req.category.title = req.body.category.title;
      }

      if(typeof req.body.category.icon !== 'undefined'){
        req.category.icon = req.body.category.icon;
      }

      if(typeof req.body.category.status !== 'undefined'){
        req.category.status = req.body.category.status;
      }

      req.category.save().then(function(category){
        return res.json({category: category.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete
router.put('/:category/delete', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.category.created_by._id.toString() === req.payload.id.toString()){

      req.category.status = "inactive";

      req.category.save().then(function(category){
        return res.json({category: category.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

module.exports = router;
