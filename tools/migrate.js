var Category = require('../models/category');
var Class = require('../models/class');
var Course = require('../models/course');
var Invitation = require('../models/invitation');
var Order = require('../models/order');
var Teacher = require('../models/teacher');
var User = require('../models/user');

var orm = require('../models/orm');

// create database
console.log("PLEASE create databse 'xueshupa' first before first execution!");

// sync database schema
orm.sync().then(function(){
  console.log("sync db ok.");
}).catch(function(error){
  console.log("sync db error:" + error);
});