var express = require('express');
var router = express.Router();

// load config file
var jsonfile = require("jsonfile");
var path = require("path")
var config = jsonfile.readFileSync(path.join(__dirname,"../../config.json"));

// admin auth.
router.use(function(req, res, next){
  if(req.session.admin){
    next();
  } else {
    if(req.path != '/login'){
      res.redirect('/admin/login');
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
router.use('/qiniu', require('./qiniu'));

// default admin index, redirect to courses.
router.get('/', function(req, res, next) {
  res.redirect("courses");
});

// admin login
router.get('/login', function(req, res, next) {
  res.render('admin/login', {error: null});
});
router.post('/login', function(req, res, next) {
  if(req.body.username == config.admin.username && req.body.password == config.admin.password){
    req.session.admin = true;
    res.redirect('/admin');
  } else {
    res.render('admin/login', {error: '用户名或密码错误，请重新登录！'});
  }
});

// admin logout
router.get('/logout', function(req, res, next) {
  delete req.session.admin;
  res.redirect('admin/login');
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
