var express = require('express');
var router = express.Router();

var _ = require('underscore');

var crypto = require('crypto');
var md5 = crypto.createHash('md5');

var errors = require('../lib/errors');
var code = require('../lib/code');
var conf = require('../lib/config');

var User = require('../models').User;

var renderConf = {
  qiniuDomain: conf.qiniu.url,
  tips: '',
  action: 'show'
}

router.get('/', function(req, res, next) {
  res.render('register', renderConf);
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
    user.password = md5.update(user.password).digest('base64');

    User.create(user).then(function(){
      return res.redirect('/');
    }).catch(function(error){
      console.log(error);
      data.tips = '注册失败';
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
