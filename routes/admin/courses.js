var express = require('express');
var router = express.Router();

var Course = require('../../models').Course;
var Category = require('../../models').Category;

// course management
router.get('/', function(req, res, next) {
  var curpage = parseInt(req.query.curpage) || 0;
  var perpage = parseInt(req.query.perpage) || 10;
  var search = req.query.search || '';

  var showpage = 5;

  var conditions = {
    offset: curpage * perpage,
    limit: perpage,
    include: [Category],
    order: [['id', 'DESC']]
  };
  if (search) {
    conditions.where = {
      name: {
        $like: '%' + search + '%'
      }
    }
  }

  Course.findAndCountAll(conditions).then(function(result){  
    res.render('admin/courses', {
      nav: 'courses',
      courses: result,
      stylesheets: [],
      javascripts: [],
      search: search,
      pagination: {
        showpage : showpage,
        curpage: curpage,
        perpage: perpage,
        count: result.count,
        query: 'search=' + search
      }
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
    nav: 'courses',
    javascripts: ['/admin/course.js'],
    stylesheets: [],
    action: 'new'
  });
});

// course create form action
router.post('/new', function(req, res, next) {
  Course.build(req.body).save().then(function() {
    res.redirect('/admin/courses');
  }).catch(function(error){
    console.log(error);
    res.render('error', {
      message: error,
      error: {}
    });
  });
});

// course edit
router.get('/edit', function(req, res, next) {
  Course.findById(req.query.id).then(function(result) {
    res.render('admin/course', {
     nav: 'courses',
     javascripts: ['/admin/course.js'],
     stylesheets: [],
     action: 'edit',
     course: result
    });
  }).catch(function(error) {
    console.log(error);
    res.render('error', {
      message: error,
      error: {}
    });
  });
});


// course edit
router.post('/edit', function(req, res, next) {
  Course.upsert(req.body).then(function(course){
    res.redirect('/admin/courses');
  }).catch(function(error){
    console.log(error);
    res.render('error', {
      message: error,
      error: {}
    });
  });
});

// category create
router.post('/category', function(req, res, next) {
  Category.build(req.body).save().then(function(result){
    res.json({
      code: 0,
      message: 'ok',
      data: result.id
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