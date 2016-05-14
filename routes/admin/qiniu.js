var express = require('express');
var router = express.Router();

var path = require('path');
var jsonfile = require('jsonfile');
var qiniu = require('qiniu');

var config = require('../../config');
// var conf = jsonfile.readFileSync(path.join(__dirname,"../../config.json"));

qiniu.conf.ACCESS_KEY = conf.qiniu.accesskey;
qiniu.conf.SECRET_KEY = conf.qiniu.secretkey;

router.get('/uptoken', function(req, res, next) {
  console.log(conf.qiniu.bucket);
  var policy = new qiniu.rs.PutPolicy(conf.qiniu.bucket);
  res.json({
    uptoken: policy.token()
  });
});


module.exports = router;
