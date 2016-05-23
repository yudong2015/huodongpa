var express = require('express');
var router = express.Router();

var _ = require('underscore');

var renderConf = {
  tips: '',
  action: 'show',
  title: '登录-活动葩',
  style: 'login',
  page: 'login',
  user: null
}

router.get('/', function(req, res, next) {
    //res.send('logout');

    req.session.user = null;
    res.redirect('/login');
});


module.exports = router;
