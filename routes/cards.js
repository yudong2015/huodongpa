var express = require('express');
var router = express.Router();

var _ = require('underscore');

var userAuth = require('../lib/middlewares').userAuth;

var Course = require('../models').Course;
var Category = require('../models').Category;
var Class = require('../models').Class;
var Teacher = require('../models').Teacher;
var Order = require('../models').Order;

var renderConf = {
  tips: '',
  title: '听课证-活动葩',
  style: 'teacher',
  page: 'card'
}

router.use(userAuth);

router.get('/', function(req, res, next) {
  var scope = req.query['scope'] || 'register';
  var data = _.extend(renderConf);
  data.user = req.session.user;
  data['scope'] = scope;

  Order.findAll({
    where: {
      userId: req.session.user.id,
      status: 'paid'
    },
    include: [ 
      {
      model: Class, 
      include : [
        Teacher, 
        {
          model: Course,
          include: Category
        },
        {
          model: Order,
          as : 'Orders'
        }
      ]
    }]
  }).then(function(orders) {
    data.orders = orders;
    res.render('cards', data);
  }).catch(function(err){
    console.log(err);
    next(err);
  });
});

module.exports = router;