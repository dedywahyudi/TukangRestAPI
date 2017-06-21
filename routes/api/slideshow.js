var mongoose = require('mongoose');
var router = require('express').Router();
var Slideshow = mongoose.model('Slideshow');

router.post('/slideshow', function(req, res, next){
  var slideshow = new Slideshow();

  slideshow.image = req.body.slideshow.image;
  slideshow.url = req.body.slideshow.url;
  slideshow.status = req.body.slideshow.status;

  slideshow.save().then(function(){
    return res.json({slideshow: slideshow.toJSONFor()});
  }).catch(next);
});

module.exports = router;
