var express = require('express');
var router = express.Router();

router.use(require('../lib/middlewares').userAuth);

var utils = require('../lib')

var Class = require('../models').Class;
var Order = require('../models').Order;
var Course = require('../models').Course;

var renderConf = {
  tips: '',
  title: '课程表-学术葩',
  style: 'teacher',
  page: 'syllabus'
};


var _ = require('underscore');


router.get('/', function(req, res, next) {
  var data = _.extend(req.query, renderConf);
  var nowDay = new Date();  

  data.user = req.session.user;
  data.year = req.query.year || parseInt(nowDay.getFullYear());
  data.month =req.query.month || parseInt(nowDay.getMonth()); 

  res.render('syllabus', data);
});

router.get('/classes', function(req, res, next) {
  var year = req.query.year;
  var month = req.query.month;

  Order.findAll({
    where: {
      userId: req.session.user.id,
      status: 'paid'
    },
    include: [
    {
      model: Class,
      include: Course
    }]
  }).then(function(orders) {
    var classes = utils.getUserClassesByMonth(orders, year, month);
    res.json({
      code: 0,
      data: classes
    });
  }).catch(function(err){
    console.log(err);
    res.json({
      code: -1,
      message: err
    });
  });
});

module.exports = router;