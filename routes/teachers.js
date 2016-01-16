var express = require('express');
var router = express.Router();

var Course = require('../models').Course;
var Category = require('../models').Category;
var Class = require('../models').Class;
var Teacher = require('../models').Teacher;

var _ = require('underscore');
var Promise = require('bluebird');
var utils = require('../lib')

var renderConf = {
  tips: '',
  title: '教师列表-学术葩',
  style: 'login',
  page: 'teachers'
};

router.get('/', function(req, res, next) {
  var search = req.query.search || '';
  var category = req.query.category || '';

  var name = req.query.name || '全部老师';

  var conditions = {
    include: [
      { 
        model: Class, 
        as: 'Classes',
        include: [{
          model: Course, 
          include: [Category]
        }]
      }
    ],
    where: {

    }
  };
  if (search) {
    conditions.where.name = {
      $like: '%' + search + '%'
    }
  }

  var data = _.extend(req.query, renderConf);

  data.user = req.session.user;
  
  Promise.join(Teacher.findAll(conditions), Category.findAll(), function(teachers, categories){
    var pinyin = utils.sortNameByPinyin(teachers);
    data.teachers = teachers;
    data.categories = categories;
    data.count = teachers.length;
    data.name = name;
    data.pinyin = pinyin;
    data.search = search;
    data.category = category;
    res.render('teachers', data);
  }).catch(function(error){
    console.log(error);
    next(error);
  });
});

router.get('/detail', function(req, res, next) {
  var data = _.extend(req.query, renderConf);
  data.user = req.session.user;

  Teacher
    .findById(req.query.id, {
      include: {
        model: Class,
        as: "Classes",
        include : {
          model: Course,
          include: [
            Category,
            {
              model: Class,
              as : 'Classes'
            }
          ]
        }
      }
    })
    .then(function(teacher){
      data.teacher = teacher;
      res.render('teacher', data);
    })
    .catch(function(err) {
      console.log(error);
      next(error);
    });
});

module.exports = router;