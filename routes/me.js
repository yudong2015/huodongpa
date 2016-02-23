var express = require('express');
var router = express.Router();

var _ = require('underscore');
var userAuth = require('../lib/middlewares').userAuth;

var conf = require('../lib/config');

var User = require('../models/').User;

var renderConf = {
  tips: '',
  title: '我的账号-学术葩',
  style: 'teacher',
  page: 'me'
}

router.use(userAuth);

router.get('/', function(req, res, next) {
  var data = _.clone(renderConf);

  data.user = req.session.user;
  res.render('me', data);
});

router.get('/edit', function(req, res, next) {
  var data = _.clone(renderConf);

  data.title = '编辑账号-学术葩';
  data.style = 'login';
  data.user = req.session.user;
  data.qiniuDomain = conf.qiniu.url;

  res.render('me-edit', data);
});

router.post('/edit', function(req, res, next) {
  var user = _.extend(req.session.user, req.body);

  User.upsert(user).then(function(course){
    req.session.user = user;
    res.redirect('/me');
  }).catch(function(error){
    var data = _.clone(renderConf);

    data.title = '编辑账号-学术葩';
    data.style = 'login';
    data.tips = '保存出错，请稍后重试';
    data.user = req.session.user;
    data.qiniuDomain = conf.qiniu.url;

    console.log(error);

    res.render('me-edit', data)
  });
});

module.exports = router;
