var express = require('express');
var router = express.Router();

var Promise = require('bluebird');
var Sequelize = require("sequelize");

var Class = require('../../models').Class;
var Course = require('../../models').Course;
var Category = require('../../models').Category;
var Teacher = require('../../models').Teacher;
var Order = require('../../models').Order;

var orm = require('../../models/orm');

var lib = require('../../lib');

// classes list
router.get('/', function(req, res, next) {
  var courseId = req.query.course;
  var scope = req.query.scope || 'preregister';

  var curpage = parseInt(req.query.curpage) || 0;
  var perpage = parseInt(req.query.perpage) || 10;

  var showpage = 5;

  var conditions = {
    where: {courseId: courseId},
    include: [Teacher, {
      model: Order,
      as : 'Orders'
    }],
    order: [['id', 'DESC']]
  };

  Course.findById(courseId, {include: [
      Category, 
      { 
        model: Class, 
        as: 'Classes', 
        include: [Teacher] 
      }
    ]}).then(function(course){

    // no repeat teachers
    course.teachers = lib.findNoRepeatTeachersOfCourse(course);

    return Class.findAll(conditions).then(function(classes){
      var scopedClasses = [];
      for(var i=0; i<classes.length; i++) {
        if(lib.getClassStatus(classes[i]) == scope){
          scopedClasses.push(classes[i]);
        }
      }

      res.render('admin/classes', {
        nav: 'courses',
        course: course,
        classes: scopedClasses.slice(curpage * perpage, (curpage+1) * perpage),
        stylesheets: [],
        javascripts: ['/admin/classes.js'],
        scope: scope,
        pagination: {
          showpage : showpage,
          curpage: curpage,
          perpage: perpage,
          count: scopedClasses.length,
          query: 'course=' + courseId + '&scope=' + scope
        }
      });
    })
  }).catch(function(error){
    console.log(error);
    next(error);
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
    next(error);
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
    next(error);
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
    next(error);
  });
});

// class create form action
router.post('/edit', function(req, res, next) {
  var clas = req.body;
  Class.upsert(clas).then(function(){
    res.redirect('/admin/classes?course='+clas.courseId);
  }).catch(function(error){
    console.log(error);
    next(error);
  });
});

// class delete
router.post('/delete', function(req, res, next) {
  Class.destroy({ where: {id : req.body.id}
  }).then(function(){
    res.json({
      code: 0,
      message: "ok"
    });
  }).catch(function(error){
    console.log(error);
    res.json({
      code: 1,
      message: "有报名的班级无法删除！"
    });
  });
});

// class show or hide
router.post('/show', function(req, res, next) {
  Class.update(
    { 'showInFrontEnd': req.body.showInFrontEnd},
    { where: {id : req.body.id}}
  ).then(function(){
    res.json({
      code: 0,
      message: "ok"
    });
  }).catch(function(error){
    console.log(error);
    res.json({
      code: 1,
      message: "更新展示失败"
    });
  });
});

// class combine operation
router.post('/combine', function(req, res, next) {
  var src = req.body.source;
  var des = req.body.dest;

  if(src == des){
    return res.json({
      code: -2,
      message: '目标班级和源班级不可相同！'
    });
  }

  Promise
  .all([
  Order.findAll({
    where: {
      classId: src
    }
  }), 
  Class.findById(des),
  Class.findById(src)
  ]).then(function(result) {
    var orders = result[0];
    var clas = result[1];
    var srcClas = result[2];
    return orm.transaction(function (t){
      return orm.query("UPDATE orders set classId=?, tuition=? where classId=?", 
        { 
          replacements: [des, clas.tuition, src],
          type: Sequelize.QueryTypes.UPDATE,
          transaction: t
        }
      ).then(function(){
        srcClas.status = 'canceled';
        return srcClas.save()
      })
    });
    
  }).then(function(){
    res.json({
      code: 0
    });
  }).catch(function(err) {
    console.log(err);
    res.json({
      code: -1
    });
  });
});


// class combine operation
router.post('/cancel', function(req, res, next) {
  var src = req.body.id;

  Class.findById(src)
  .then(function(clas) {
    clas.status = 'canceled';
    return clas.save();
  }).then(function() {
    return orm.query("UPDATE orders set status='canceled' where classId=?", 
      {
        replacements: [src],
        type: Sequelize.QueryTypes.UPDATE
      }
    )
  }).then(function(){
    res.json({
      code: 0
    });
  })
  .catch(function(err) {
    console.log(err);
    res.json({
      code: -1,
      message: err
    });
  });
});




module.exports = router;