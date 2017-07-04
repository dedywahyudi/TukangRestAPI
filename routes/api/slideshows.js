var router = require('express').Router();
var mongoose = require('mongoose');
var Slideshow = mongoose.model('Slideshow');
var User = mongoose.model('User');
var auth = require('../auth');

// param
router.param('slideshow', function(req, res, next, slug) {
  Slideshow.findOne({ slug: slug})
    .populate('created_by')
    .then(function(slideshow){
      if(!slideshow) { return res.sendStatus(404); }

      req.slideshow = slideshow;

      return next();
  }).catch(next);
});

// get all
router.get('/', auth.optional, function(req, res, next) {
  Promise.all([
    Slideshow.find().sort('createdAt'),
    Slideshow.count()
  ]).then(function(results){
    var slideshow = results[0];
    var slideshowCount = results[1];

    return res.json({
      slideshow: slideshow.map(function(slideshow){
        return slideshow.toJSONFor();
      }),
      slideshowCount: slideshowCount
    });

  }).catch(next);
});

// create new
router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var slideshow = new Slideshow(req.body.slideshow);

    slideshow.created_by = user;

    return slideshow.save().then(function(){
      // console.log(slideshow.created_by);
      return res.json({slideshow: slideshow.toJSONFor(user)});
    });
  }).catch(next);
});

// update
router.put('/:slideshow', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.slideshow.created_by._id.toString() === req.payload.id.toString()){
      if(typeof req.body.slideshow.image !== 'undefined'){
        req.slideshow.image = req.body.slideshow.image;
      }

      if(typeof req.body.slideshow.url !== 'undefined'){
        req.slideshow.url = req.body.slideshow.url;
      }

      if(typeof req.body.slideshow.status !== 'undefined'){
        req.slideshow.status = req.body.slideshow.status;
      }

      req.slideshow.save().then(function(slideshow){
        return res.json({slideshow: slideshow.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete alias update status
router.put('/:slideshow/delete', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.slideshow.created_by._id.toString() === req.payload.id.toString()){

      req.slideshow.status = "inactive";

      req.slideshow.save().then(function(slideshow){
        return res.json({slideshow: slideshow.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

module.exports = router;
