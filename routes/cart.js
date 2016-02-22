var express = require('express');
var router = express.Router();

var errors = require('../lib/errors');
var _ = require('underscore');

var Class = require('../models').Class;
var Teacher = require('../models').Teacher;
var Course = require('../models').Course;
var Category = require('../models').Category;
var Order = require('../models').Order;

var renderConf = {
  tips: '',
  title: '购课车-学术葩',
  style: 'teacher',
  page: 'car'
}

router.use(require('../lib/middlewares').userAuth);

router.post('/add', function(req, res, next) {
  var classid = req.body.id;
  if (!classid){
    return res.json(errors.ERR_WRONGARG);
  }

  if( !req.session.cart ) {
    req.session.cart = {};
  }

  Class.findById(classid, {include: [
      Teacher,
      {
        model: Course,
        include: Category
      }
    ]}).then(function(clas){
    req.session.cart[classid] = clas;
    res.json(errors.OK);
  }).catch(function(err){
    res.json(errors.ERR_CLASSNOTFOUND);
  });
});

router.post('/delete', function(req, res, next) {
  var classids = req.body.id.split(',');
  if (req.session.cart) {
    for(var id in classids){
      delete req.session.cart[classids[id]];
    }
  }

  res.json({
    code : 0
  })
});

router.post('/buy', function(req, res, next) {
  var classids = req.body.id.split(',');
  var orders = [];
  if (req.session.cart && req.session.user) {
    for(var i=0; i<classids.length; i++) {
      if(req.session.cart[classids[i]]) {
        orders.push({
          classId: classids[i],
          userId: req.session.user.id,
          tuition: req.session.cart[classids[i]].tuition,
          status: 'unpaid'
        });
      }
    }
    Order.bulkCreate(orders).then(function(){
      for(var i=0; i<classids.length; i++) {
        delete req.session.cart[classids[i]];
      }
      res.json({code: 0});
    }).catch(function(err){
      res.json({
        code: -1,
        message: err
      });
    });
  } else {
    res.json({
      code: -2,
      message: 'user not login or cart is empty.'
    });
  }
});

router.get('/classes/paid', function(req, res, next) {
  Order.findAll({
    where: {
      userId: req.session.user.id,
      status: 'paid'
    },
    include: Class
  }).then(function(orders) {
    res.json({
      code: 0,
      data: orders
    });
  }).catch(function(err){
    console.log(err);
    res.json({
      code: -1,
      message: err
    });
  });
});

router.get('/', function(req, res, next) {
  var data = _.clone(renderConf);

  data.user = req.session.user;
  data.cart = req.session.cart;

  Order.findAll({
    where: {
      userId: req.session.user.id,
      status: 'unpaid'
    },
    include: {
      model: Class,
      include: [{
        model: Course,
        include : Category
      }, Teacher]
    }
  }).then(function(orders) {
    data.orders = orders;
    res.render('cart', data);
  }).catch(function(err){
    console.log(err);
    next(err);
  });
});

module.exports = router;
