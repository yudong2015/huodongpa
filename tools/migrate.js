var Sequelize = require('../models').Sequelize;

// create database
console.log("PLEASE create databse 'activitypar' first before first execution!");

// sync database schema
Sequelize.sync().then(function(){
  console.log("sync db ok.");
}).catch(function(error){
  console.log("sync db error:" + error);
});
