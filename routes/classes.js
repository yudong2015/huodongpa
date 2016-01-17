var express = require('express');
var router = express.Router();

var Course = require('../models').Course;
var Category = require('../models').Category;
var Class = require('../models').Class;
var Teacher = require('../models').Teacher;
var Order = require('../models').Order;

var errors = require('../lib/errors')

var _ = require('underscore');
var Promise = require('bluebird');

var utils = require('../lib');

var renderConf = {
  tips: '',
  title: '课程详情-学术葩',
  style: 'teacher',
  page: 'course-detail'
}

router.get('/', function(req, res, next) {
  var courseid = req.query.course;

  var data = _.clone(renderConf);

  data.user = req.session.user;

  var conditions = {
    include: [
      Category, 
      { 
        model: Class, 
        as: 'Classes',
        include: [{
          model: Teacher,
          include: [{ 
            model: Class, 
            as: 'Classes', 
            include: [{
              model: Course, 
              include: [Category]
            }] 
          }]
        }]
      }]
  };

  Course.findById(courseid, conditions).then(function(course){
    var dates = [];
    for (var i=0; i<course.Classes.length; i++) {
      // check if class is in cart
      if (req.session.cart) {
        if(req.session.cart[course.Classes[i].id]){
          course.Classes[i].inCart = true;
        }
      }
    }
    data.course = course;
    data.teachers = utils.findNoRepeatTeachersOfCourse(course);
    for( var id in data.teachers) {
      data.teachers[id].categories = {};
      for (var i=0; i<data.teachers[id].Classes.length; i++) {
        if(data.teachers[id].Classes[i].course) {
          data.teachers[id].categories[data.teachers[id].Classes[i].course.category.id] = data.teachers[id].Classes[i].course.category;
        }
      }
    }
    res.render('classes', data);
  });

});

router.get('/mine', function(req, res, next) {
  if (!req.session.user) {
    return res.json({
      code: 0,
      message: '',
      data : []
    });
  }

  Order.findAll({
    where: {
      userId: req.session.user.id,
      status: 'paid'
    },
    include: Class 
  }).then(function(classes){
    res.json({
      code: 0,
      message: '',
      data : classes
    })
  }).catch(function(err) {
    console.log(err);
    res.json(errors.ERR_WRONGARG)
  });
});

module.exports = router;