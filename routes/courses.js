var express = require('express');
var router = express.Router();

var _ = require('underscore');
var Promise = require('bluebird');
var utils = require("../lib/");

var Course = require('../models').Course;
var Category = require('../models').Category;
var Class = require('../models').Class;

var renderConf = {
  tips: '',
  title: '课程列表-学术葩',
  style: 'teacher',
  page: 'course'
}

router.get('/', function(req, res, next) {

  var search = req.query.search || '';
  var category = req.query.category;

  var name = req.query.name || '全部课程';

  var conditions = {
    include: [
      Category, 
      { 
        model: Class, 
        as: 'Classes'
      }],
    where : {}
  };
  if (search) {
    conditions.where.name = {
      $like: '%' + search + '%'
    }
  }
  if (category) {
    conditions.where.categoryId = category;
  }

  var data = _.extend(req.query, renderConf);
  
  Promise.join(Course.findAll(conditions), Category.findAll(), function(courses, categories){
    var pinyin = utils.sortCoursesByPinyin(courses);
    data.courses = courses;
    data.categories = categories;
    data.name = name;
    data.pinyin = pinyin;
    res.render('courses', data);
  }).catch(function(error){
    console.log(error);
    next(error);
  });

});

module.exports = router;