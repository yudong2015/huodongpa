var express = require('express');
var router = express.Router();

var _ = require('underscore');

var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var _ = require('underscore');

var errors = require('../lib/errors');
var code = require('../lib/code');
var conf = require('../lib/config');

var User = require('../models').User;
var Recommend = require('../models').Recommend;

var renderConf = {
  qiniuDomain: conf.qiniu.url,
  tips: '',
  action: 'show',
  title: '注册-学术葩',
  style: 'login',
  page: 'register',
  user: null
}

router.get('/', function(req, res, next) {
  var data = _.clone(renderConf);
  data.user = req.session.user;
  res.render('register', data);
});

router.post('/', function(req, res, next) {
  var data = _.extend({form: req.body}, renderConf);
  data.action = 'reform';
  code.validateVerifyCode(req.body.username, req.body.code, function(err) {
    if (err) {
      data.tips = '验证码错误';
      return res.render('register', data);
    } 

    var user = _.clone(req.body);
    var md5 = crypto.createHash('md5');
    user.password = md5.update(user.password).digest('base64');

    User.create(user).then(function(created){
      if(req.query.user) {
        Recommend.create({
          userId: req.query.user,
          recommended: created.id
        })
      }

      return res.redirect('/login');
    }).catch(function(error){
      console.log(error);
      data.tips = '该手机号已经注册';
      return res.render('register', data);
    });
  })
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
