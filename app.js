var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var routes = require('./routes');
var admin = require('./routes/admin');
var logout = require('./routes/logout');

// load config file
var jsonfile = require("jsonfile");
var path = require("path")

var config = require('./config');
// var config = jsonfile.readFileSync(path.join(__dirname,"./config.json"));

var json2xls = require('json2xls');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// template helper functions
app.locals = require('./lib/helpers');

// session setup
app.use(session({
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({host:config.redis.host,port:config.redis.port}),
  rolling: true,
  secret: config.redis.sessionSecret,
  cookie: {
    maxAge: 1000*60*60*24*7
  }
}));

app.use(json2xls.middleware);
app.use('/', routes);
app.use('/logout', logout);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
