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

var Promise = require('bluebird');

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

module.exports = router;