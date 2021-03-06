var express = require('express');
var router = express.Router();

var Course = require('../../models').Course;
var Category = require('../../models').Category;
var Class = require('../../models').Class;
var Teacher = require('../../models').Teacher;
var _ = require('underscore');
var lib = require('../../lib');
var config = require('../../config');

// course management
router.get('/', function(req, res, next) {
  var curpage = parseInt(req.query.curpage) || 0;
  var perpage = parseInt(req.query.perpage) || 10;
  var search = req.query.search || '';

  var showpage = 5;

  var conditions = {
    offset: curpage * perpage,
    limit: perpage,
    include: [
      Category, 
      { 
        model: Class, 
        as: 'Classes', 
        include: [Teacher] 
      }
    ],
    order: [['id', 'DESC']]
  };

  req.session.manager.role==config.default.managerRole.normal && (conditions.where = {
    managerId: req.session.manager.id
  });
  if (search) {
    conditions.where.name = {
        $like: '%' + search + '%'
    }
  }
  
  Course.findAndCountAll(conditions).then(function(result){ 

    // no repeat teachers
    for(var i=0; i<result.rows.length; i++) {
      result.rows[i].teachers = lib.findNoRepeatTeachersOfCourse(result.rows[i]);
    }


    res.render('admin/courses', {
      nav: 'courses',
      user_:{username:req.session.manager.username,role:req.session.manager.role},
      courses: result,
      stylesheets: [],
      javascripts: ['/admin/courses.js'],
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
    next(error);
  });
});

// course create
router.get('/new', function(req, res, next) {
  res.render('admin/course', {
    nav: 'courses',
    user_:{username:req.session.manager.username,role:req.session.manager.role},
    javascripts: ['/thirdparty/pupload/plupload.full.min.js', '/thirdparty/qiniu/qiniu.min.js','/admin/course.js'],
    stylesheets: [],
    action: 'new',
    'qiniuDomain': config.qiniu.url
  });
});

// course create form action
router.post('/new', function(req, res, next) {
  Course.build(_.extend(req.body,{managerId:req.session.manager.id})).save().then(function() {
    res.redirect('/admin/courses');
  }).catch(function(error){
    console.log(error);
    next(error);
  });
});

// course edit
router.get('/edit', function(req, res, next) {
  Course.findById(req.query.id).then(function(result) {
    res.render('admin/course', {
     nav: 'courses',
     user_:{username:req.session.manager.username,role:req.session.manager.role},
     javascripts: ['/thirdparty/pupload/plupload.full.min.js', '/thirdparty/qiniu/qiniu.min.js','/admin/course.js'],
     stylesheets: [],
     action: 'edit',
     'qiniuDomain': config.qiniu.url,
     course: result
    });
  }).catch(function(error) {
    console.log(error);
    next(error);
  });
});


// course edit
router.post('/edit', function(req, res, next) {

  Course.upsert(req.body).then(function(course){
    res.redirect('/admin/courses');
  }).catch(function(error){
    console.log(error);
    next(error);
  });
});

// course delete
router.post('/delete', function(req, res, next) {
  Course.destroy({ where: {id : req.body.id}
  }).then(function(){
    res.json({
      code: 0,
      message: "ok"
    });
  }).catch(function(error){
    console.log(error);
    res.json({
      code: -1,
      message: error
    });
  });
});

// category create
router.post('/category', function(req, res, next) {
  req.body.managerId = req.session.manager.id;
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