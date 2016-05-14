var express = require('express');
var router = express.Router();

var _ = require('underscore');

var crypto = require('crypto');
var md5 = crypto.createHash('md5');

var errors = require('../lib/errors');
var code = require('../lib/code');

var conf = require('../config');
// var conf = require('../lib/config');

var User = require('../models').User;

var renderConf = {
  tips: '',
  action: 'show',
  title: '重置密码-学术葩',
  style: 'login',
  page: 'reset'
}

router.get('/phone', function(req, res, next) {
  var data = _.clone(renderConf);
  data.user = req.session.user;
  res.render('reset-phone', data);
});

router.post('/phone', function(req, res, next) {
  var data = _.extend({form: req.body}, renderConf);
  data.action = 'reform';
  data.user = req.session.user;
  code.validateVerifyCode(req.body.phone, req.body.code, function(err) {
    if (err) {
      data.tips = '验证码错误';
      return res.render('reset-phone', data);
    } 
    user.username = req.body.phone;
    user.save().then(function(user){
      req.session.user = user;
      return res.redirect('/me');
    }).catch(function(error){
      data.tips = '绑定失败，请重试';
      return res.render('reset-phone', data);
    });
  })
});

router.get('/step1', function(req, res, next) {
  var data = _.clone(renderConf);
  data.user = req.session.user;
  res.render('reset1', data);
});

router.post('/step1', function(req, res, next) {
  var data = _.extend({form: req.body}, renderConf);
  data.action = 'reform';
  data.user = null;
  code.validateVerifyCode(req.body.phone, req.body.code, function(err) {
    if (err) {
      data.tips = '验证码错误';
      return res.render('reset1', data);
    } 
    User.find({
      where: {
        username: req.body.phone
      }
    }).then(function(user){
      req.session.user = user;
      return res.redirect('/reset/step2');
    }).catch(function(error){
      data.tips = '用户不存在';
      return res.render('reset1', data);
    });
  })
});

router.use('/step2', require('../lib/middlewares').userAuth);
router.get('/step2', function(req, res, next) {
  var data = _.clone(renderConf);
  data.user = req.session.user;

  res.render('reset2', data);
});
router.post('/step2', function(req, res, next) {
  var data = _.extend({form: req.body}, renderConf);
  var user = req.session.user;
  var md5 = crypto.createHash('md5');
  user.password = md5.update(req.body.password).digest('base64');
  User.upsert(user).then(function(){
    res.redirect("/");
  }).catch(function(error){
    data.tips = '系统出错，请稍后再试';
    res.render('reset2', data);
  });
});


router.post('/code', function(req, res, next) {
  console.log("sending code to phone " + req.body.phone);
  code.sendVerifyCode(req.body.phone, function(err) {
    if (err) {
      return res.json(errors.ERR_SENDCODE);
    }

    return res.json(errors.OK);
  });
});

module.exports = router;
