var express = require('express');
var router = express.Router();

var Course = require('../../models/course');
var Category = require('../../models/category');

// course management
router.get('/', function(req, res, next) {
  var curpage = req.query.curpage || 0;
  var perpage = req.query.perpage || 20;
  var search = req.query.search;

  var contions = {
    offset: curpage * perpage,
    limit: perpage
  }
  if (search) {
    contions.where = {
      name: {
        $like: search
      }
    }
  }

  Course.findAndCountAll(contions).then(function(result){  
    res.render('admin/courses', {
      nav: 'courses',
      courses: result
    });
  }).catch(function(error){
    console.log(error);
    res.render('error', {
      message: error,
      error: {}
    });
  });
});

// course create
router.get('/new', function(req, res, next) {
  res.render('admin/course', {
    nav: 'courses'
  });
});

// category create
router.post('/category', function(req, res, next) {
  Category.build(req.body).save().then(function(){
    res.json({
      code: 0,
      message: 'ok'
    });
  }).catch(function(error){
    res.json({
      code: -1,
      message: error
    });
  });
});

// category list
router.get('/categories', function(req, res, next) {
  Category.findAll().then(function(result){
    res.json({
      code: 0,
      message: 'ok',
      data: result
    });
  }).catch(function(error){
    res.json({
      code: -1,
      message: error
    });
  });
});

module.exports = router;