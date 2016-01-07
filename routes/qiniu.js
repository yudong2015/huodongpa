var express = require('express');
var router = express.Router();

var conf = require('../lib/config');
var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = conf.qiniu.accesskey;
qiniu.conf.SECRET_KEY = conf.qiniu.secretkey;

router.get('/uptoken', function(req, res, next) {
  var policy = new qiniu.rs.PutPolicy(conf.qiniu.bucket);
  res.json({
    uptoken: policy.token()
  });
});


module.exports = router;