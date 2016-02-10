var express = require('express');
var router = express.Router();

var Class = require('../../models').Class;
var Course = require('../../models').Course;
var Category = require('../../models').Category;
var Teacher = require('../../models').Teacher;
var Order = require('../../models').Order;
var User = require('../../models').User;

var Promise = require('bluebird');
var _ = require('underscore');

router.get('/', function(req, res, next){
  // res.render('admin/orders');

  var clasId = req.query.clas;

  var curpage = parseInt(req.query.curpage) || 0;
  var perpage = parseInt(req.query.perpage) || 10;

  var showpage = 5;

  var conditions = {
    offset: curpage * perpage,
    limit: perpage,
    where: {classId: clasId},
    include: [User],
    order: [['id', 'DESC']]
  };
 
  Promise.all([
    Class.findById(clasId, {include: [
      Course, 
      Teacher,
      {
        model: Order,
        as : 'Orders'
      }
    ]}), 
    Order.findAndCountAll(conditions)
  ]).then(function(result){
    var clas = result[0];
    var orders = result[1];
    res.render('admin/orders', {
      nav: 'courses',
      clas: clas,
      orders: orders,
      stylesheets: [],
      javascripts: ['/thirdparty/bootstrap-typeahead/typeahead.jquery.min.js','/admin/order.js'],
      pagination: {
        showpage : showpage,
        curpage: curpage,
        perpage: perpage,
        count: orders.count,
        query: 'clas=' + clasId
      }
    });
  }).catch(function(error){
    console.log(error);
    next(error);
  });

});

router.post('/add', function(req, res, next) {
  Class
    .findById(req.body.classId)
    .then(function(clas){
      var order = _.clone(req.body);
      order.tuition = clas.tuition;
      order.status = 'paid';
      return Order.upsert(order);
    }).then(function() {
      res.redirect('/admin/orders?clas=' + req.body.classId);
    }).catch(function(err) {
      console.log(err);
      next(err);
    });
  
});

router.post('/cancel', function(req, res, next) {
  Order
    .findById(req.body.id)
    .then(function(order){
      order.status = 'canceled';
      return order.save();
    }).then(function() {
      res.json({
        code : 0
      })
    }).catch(function(err) {
      console.log(err);
      res.json({
        code: -1,
        message: err
      });
    });
  
});

router.post('/recover', function(req, res, next) {
  Order
    .findById(req.body.id)
    .then(function(order){
      order.status = 'paid';
      return order.save();
    }).then(function() {
      res.json({
        code : 0
      })
    }).catch(function(err) {
      console.log(err);
      res.json({
        code: -1,
        message: err
      });
    });
  
});

router.post('/buy', function(req, res, next) {
  var orderids = req.body.id.split(',');

  Order.update(
    {status: 'paid'},
    {
      where: {
        id: {
          $in: orderids
        }
      }
    }
  ).then(function(){
    res.json({
      code : 0
    })
  }).catch(function(err) {
    console.log(err);
    res.json({
      code: -1,
      message: err
    });
  });
});


router.post('/delete', function(req, res, next) {
  var orderids = req.body.id.split(',');

  Order.destroy(
    {
      where: {
        id: {
          $in: orderids
        }
      }
    }
  ).then(function(){
    res.json({
      code : 0
    })
  }).catch(function(err) {
    console.log(err);
    res.json({
      code: -1,
      message: err
    });
  });
});

module.exports = router;