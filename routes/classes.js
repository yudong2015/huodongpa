var express = require('express');
var router = express.Router();

var Course = require('../models').Course;
var Category = require('../models').Category;
var Class = require('../models').Class;
var Teacher = require('../models').Teacher;

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

  var conditions = {
    include: [
      Category, 
      { 
        model: Class, 
        as: 'Classes',
        include: Teacher
      }]
  };

  Course.findById(courseid, conditions).then(function(course){
    var dates = [];
    for (var i=0; i<course.Classes.length; i++) {
      dates.push(utils.splitClassDates(course.Classes[i].classDates));
    }
    console.log(dates);
    data.course = course;
    data.dates = dates;
    res.render('classes', data);
  });


});

module.exports = router;