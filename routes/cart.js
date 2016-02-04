var express = require('express');
var router = express.Router();

var errors = require('../lib/errors');
var _ = require('underscore');

var Class = require('../models').Class;
var Teacher = require('../models').Teacher;
var Course = require('../models').Course;
var Category = require('../models').Category;

var renderConf = {
  tips: '',
  title: '购物车-学术葩',
  style: 'teacher',
  page: 'car'
}

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
      delete req.session.cart[id];
    }
  }

  res.json({
    code : 0
  })
});

router.get('/', function(req, res, next) {
  var data = _.clone(renderConf);

  data.user = req.session.user;
  data.cart = req.session.cart;
  res.render('cart', data);
});

module.exports = router;