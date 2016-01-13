var express = require('express');
var router = express.Router();

var _ = require('underscore');

var crypto = require('crypto');

var errors = require('../lib/errors');
var code = require('../lib/code');

var User = require('../models').User;

var renderConf = {
  tips: '',
  action: 'show',
  title: '登录-学术葩',
  style: 'login',
  page: 'login'
}

router.get('/', function(req, res, next) {
  res.render('login', renderConf);
});

router.post('/', function(req, res, next) {
  var data = _.extend({form: req.body}, renderConf);
  data.action = 'reform';
  data.user = req.session.user;

  User.find({
    where: {
      username: req.body.username
    }
  }).then(function(user){
    if (user){
      var md5 = crypto.createHash('md5');
      var password = md5.update(req.body.password).digest('base64');
      if (password == user.password){
        req.session.user = user;
        return res.redirect('/');
      } else {
        data.tips = '密码错误';
        return res.render('login', data);
      }  
    } else {
      data.tips = '用户名不存在';
      return res.render('login', data);
    }
  }).catch(function(error){
    console.log(error);
    data.tips = '系统繁忙，请稍后再试';
    return res.render('login', data);
  });
});

module.exports = router;
