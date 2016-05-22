var express = require('express');
var router = express.Router();

// load config file
var jsonfile = require("jsonfile");
var path = require("path")

var config = require('../../config');
// var config = jsonfile.readFileSync(path.join(__dirname,"../../config.json"));

// admin auth.
router.use(function(req, res, next){
  if(req.session.manager){
    next();
  } else {
    if(req.path != '/managers/login'){
      res.redirect('/admin/managers/login');
    } else {
      next();
    }
  }
});

router.use('/courses', require('./courses'));
router.use('/classes', require('./classes'));
router.use('/orders', require('./orders'));
router.use('/teachers', require('./teachers'));
router.use('/users', require('./users'));
router.use('/managers', require('./managers'));
router.use('/profit', require('./profit'));
router.use('/qiniu', require('./qiniu'));

// default admin index, redirect to courses.
router.get('/', function(req, res, next) {
  res.redirect("courses");
});

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
router.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.render('admin/error', {
    message: err.message,
    error: err,
    stylesheets: [],
    javascripts: [],
    nav: ''
  });
});

module.exports = router;
