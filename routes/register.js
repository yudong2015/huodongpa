var express = require('express');
var router = express.Router();

var errors = require('../lib/errors');
var code = require('../lib/code');

router.get('/', function(req, res, next) {
  res.render('register');
});

router.post('/', function(req, res, next) {
  res.json(errors.OK);
});

router.post('/code', function(req, res, next) {
  code.sendVerifyCode(req.body.phone, function(err) {
    if (err) {
      return res.json(errors.ERR_SENDCODE);
    }

    return res.json(errors.OK);
  });
});

module.exports = router;
