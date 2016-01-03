var express = require('express');
var router = express.Router();

var Promise = require('bluebird');

var Class = require('../../models').Class;
var Course = require('../../models').Course;
var Category = require('../../models').Category;
var Teacher = require('../../models').Teacher;

// classes list
router.get('/', function(req, res, next) {
  var courseId = req.query.course;

  var curpage = parseInt(req.query.curpage) || 0;
  var perpage = parseInt(req.query.perpage) || 10;

  var showpage = 5;

  var conditions = {
    offset: curpage * perpage,
    limit: perpage,
    where: {courseId: courseId},
    include: [Teacher],
    order: [['id', 'DESC']]
  };

  Course.findById(courseId, {include: Category}).then(function(course){
    return Class.findAndCountAll(conditions).then(function(classes){
      res.render('admin/classes', {
        nav: 'courses',
        course: course,
        classes: classes,
        stylesheets: [],
        javascripts: [],
        pagination: {
          showpage : showpage,
          curpage: curpage,
          perpage: perpage,
          count: classes.count,
          query: 'course=' + courseId
        }
      });
    })
  }).catch(function(error){
    console.log(error);
    res.render('error', {
      message: error,
      error: {}
    });
  });
});

// class create
router.get('/new', function(req, res, next) {
  var courseId = req.query.course;
  Promise.join(Teacher.findAll(), Course.findById(courseId), function(teachers, course){
    res.render('admin/class', {
      nav: 'courses',
      course: course,
      teachers: teachers,
      javascripts: [
        '/thirdparty/bootstrap-datepicker/js/bootstrap-datepicker.min.js', 
        '/thirdparty/bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN.min.js',
        '/admin/class.js'],
      stylesheets: ['/thirdparty/bootstrap-datepicker/css/bootstrap-datepicker.min.css'],
      action: 'new'
    });
  }).catch(function(error){
    console.log(error);
    res.render('error', {
      message: error,
      error: {}
    });
  });
});

// class create form action
router.post('/new', function(req, res, next) {
  var courseId = req.query.course;
  var clas = req.body;
  clas.courseId = courseId;
  Class.create(clas).then(function(){
    res.redirect('/admin/classes?course='+courseId);
  }).catch(function(error){
    console.log(error);
    res.render('error', {
      message: error,
      error: {}
    });
  });
});

// class edit
router.get('/edit', function(req, res, next) {
  var id = req.query.id;
  Promise.join(Teacher.findAll(), Class.findById(id, {include: [Course]}), function(teachers, clas){
    res.render('admin/class', {
      nav: 'courses',
      clas: clas,
      teachers: teachers,
      javascripts: [
        '/thirdparty/bootstrap-datepicker/js/bootstrap-datepicker.min.js', 
        '/thirdparty/bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN.min.js',
        '/admin/class.js'],
      stylesheets: ['/thirdparty/bootstrap-datepicker/css/bootstrap-datepicker.min.css'],
      action: 'edit'
    });
  }).catch(function(error){
    console.log(error);
    res.render('error', {
      message: error,
      error: {}
    });
  });
});

// class create form action
router.post('/edit', function(req, res, next) {
  var clas = req.body;
  Class.findById(clas.id).then(function(clas){
    return clas.save().then(function(){
      res.redirect('/admin/classes?course='+clas.courseId);
    });
  }).catch(function(error){
    console.log(error);
    res.render('error', {
      message: error,
      error: {}
    });
  });
});

module.exports = router;