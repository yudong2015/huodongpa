var Sequelize = require("sequelize");
var jsonfile = require("jsonfile");
var path = require("path")

var conf = require('../config');
// var conf = jsonfile.readFileSync(path.join(__dirname,"../config.json"));

var orm = new Sequelize(
  conf.mysql.database, 
  conf.mysql.user, 
  conf.mysql.password, 
  { 
    host: conf.mysql.host,
    dialect: 'mysql',
    port: conf.mysql.port,
    pool: { maxConnections: 5, maxIdleTime: 30}
  }
);

module.exports = orm;
