var mongoose = require('mongoose');
var router = require('express').Router();
var Category = mongoose.model('Category');
var auth = require('../auth');

router.post('/categories', auth.required, function(req, res, next){
  var category = new Category();

  category.title = req.body.category.title;
  category.icon = req.body.category.icon;

  category.save().then(function(){
    return res.json({category: category.toJSONFor()});
  }).catch(next);
});

module.exports = router;
