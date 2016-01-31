var express = require('express');
var router = express.Router();

var _ = require('underscore');

// load config file
var jsonfile = require("jsonfile");
var path = require("path")
var config = jsonfile.readFileSync(path.join(__dirname,"../config.json"));

var renderConf = {
  tips: '',
  title: '分享-学术葩',
  style: 'teacher',
  page: 'share'
}

router.get('/', function(req, res, next) {
  var data = _.clone(renderConf);

  if(req.query.user) {
    data.user = req.session.user;
    data.userid = req.query.user;
    data.registerurl = config.domain+'/register?user=' + req.query.user;
    data.logourl = config.domain+'/img/logo.jpg';
    res.render('recommend', data);
  } else {
    res.redirect('/recommend?user='+req.session.user.id);
  }

  
});

module.exports = router;