var express = require('express');
var router = express.Router();

var _ = require('underscore');

var renderConf = {
  tips: '',
  action: 'show',
  title: '登录-学术葩',
  style: 'login',
  page: 'login',
  user: null
}

router.get('/', function(req, res, next) {
    //res.send('logout');

    req.session.user = null;
    res.render('login', renderConf);
});


module.exports = router;
