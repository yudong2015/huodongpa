var express = require('express');
var router = express.Router();

var _ = require('underscore');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');

var User = require('../../models').User;
var Teacher = require('../../models').Teacher;
var Class = require('../../models').Class;
var Order = require('../../models').Order;
var Course = require('../../models').Course;
var Category = require('../../models').Category;
var Recommend = require('../../models').Recommend;

var Promise = require('bluebird');
var utils = require('../../lib');

var DEFAULT_PASSWORD = "woaixueshupa";

router.get('/', function(req, res, next) {
  var curpage = parseInt(req.query.curpage) || 0;
  var perpage = parseInt(req.query.perpage) || 10;
  var search = req.query.search || '';

  var showpage = 5;

  var conditions = {
    offset: curpage * perpage,
    limit: perpage,
    order: [['id', 'DESC']]
  };

  if (req.query.search) {
    var number = new RegExp("^[0-9]*$");
    if(number.test(search)) {
      conditions.where = {
        username : {
          $eq: search
        }
      }
    } else {
      conditions.where = {
        name : {
          $like: '%' + search + '%'
        }
      }
    }
  }

  User.findAndCountAll(conditions).then(function(users) {
    res.render('admin/users', {
      nav: 'users',
      stylesheets: [],
      javascripts: ['/admin/users.js'],
      users: users,
      search: search,
      pagination: {
        showpage : showpage,
        curpage: curpage,
        perpage: perpage,
        count: users.count,
        query: 'search=' + search
      }
    });
  }).catch(function(error){
    console.log(error);
    next(err);
  });
});

router.get('/new', function(req, res, next) {
  res.render('admin/user', {
    nav: 'users',
    stylesheets: [],
    javascripts: []
  });
});

function genDefaultPassword(){
  var md5 = crypto.createHash('md5');
  return md5.update(DEFAULT_PASSWORD).digest('base64');
}

router.post('/new', function(req, res, next) {
  var user = _.clone(req.body);
  user.password = genDefaultPassword();
  User
    .upsert(user)
    .then(function(){
      res.redirect('/admin/users');
    }).catch(function(error){
    console.log(error);
    next(error);
  });
});

router.get('/detail', function(req, res, next) {
  var curpage = parseInt(req.query.curpage) || 0;
  var perpage = parseInt(req.query.perpage) || 10;
  var showpage = 5;
  var subnav = req.query.sub || 'history';

  var conditions = {
    offset: curpage * perpage,
    limit: perpage,
    order: [['id', 'DESC']],
    where: {
      status: 'paid',
      userId: req.query.id
    },
    include : [
      {
        model: Class,
        include: [Teacher, {
          model: Course,
          include: Category
        }]
      }
    ]
  };


  Promise.all([User.findById(req.query.id), Order.findAndCountAll(conditions)])
    .then(function(results){
      var user = results[0];
      var orderResult = results[1];

      res.render('admin/user-detail', {
        nav: 'users',
        stylesheets: [],
        javascripts: ['/admin/user-detail.js'],
        orders: orderResult.rows,
        user: user,
        sub: subnav,
        pagination: {
          showpage : showpage,
          curpage: curpage,
          perpage: perpage,
          count: orderResult.count,
          query: 'id=' + req.query.id
        }
      });
    }).catch(function(error){
      console.log(error);
      next(error);
    });

});

router.get('/recommends', function(req, res, next) {
  var curpage = parseInt(req.query.curpage) || 0;
  var perpage = parseInt(req.query.perpage) || 10;
  var showpage = 5;
  var subnav = req.query.sub || 'recommended';

  var conditions = {
    offset: curpage * perpage,
    limit: perpage,
    order: [['id', 'DESC']],
    where: {
      userId: req.query.id
    }
  };


  Promise.all([User.findById(req.query.id), Recommend.findAndCountAll(conditions)])
    .then(function(results){
      var user = results[0];
      var recommendResult = results[1];

      res.render('admin/user-detail', {
        nav: 'users',
        stylesheets: [],
        javascripts: ['/admin/user-detail.js'],
        recommends: recommendResult.rows,
        user: user,
        sub: subnav,
        pagination: {
          showpage : showpage,
          curpage: curpage,
          perpage: perpage,
          count: recommendResult.count,
          query: 'id=' + req.query.id
        }
      });
    }).catch(function(error){
      console.log(error);
      next(error);
    });
});

router.get('/info', function(req, res, next) {
  var userid = req.query.id;

  var user = {};

  User.findById(userid).then(function(result){
    user.id = result.id;
    user.name = result.name;
    user.username = result.username;

    console.log(user);

    return Order.findAll({
      where: {
        userId: user.id
      },
      include: Class
    });

  }).then(function(orders){
    var total = 0;
    if(orders){


      for(var i=0; i<orders.length; i++) {
        if((utils.getClassStatus(orders[i]['class']) == 'inclass') || (getClassStatus(orders[i]['class']) == 'end')){
          total += orders[i].tuition;
        }
      }
    }

    res.json({
      code: 0,
      data: {
        id: user.id,
        name: user.name || '无名氏',
        username: user.username,
        total: total
      }
    });
  }).catch(function(error){
    console.log(error);
    next(error);
  });
});

router.post('/recommend', function(req, res, next) {
  var id = req.query.id;

  Recommend.findById(id).then(function(recommend){
    recommend.rewarded = req.body.rewarded;
    return recommend.save();
  }).then(function(){
    res.json({
      code: 0
    })
  }).catch(function(error){
    console.log(error);
    res.json({
      code: -1,
      message: error
    });
  });
});

module.exports = router;