var Sequelize = require("sequelize");

var orm = require("./orm");

var Class = require("./class");
var User = require("./user");

module.exports = orm.define('order', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncreament: true },
  classId: { type:Sequelize.INTEGER, references: {model: Class, key: 'id'} },
  UserId: { type: Sequelize.INTEGER, references: {model: User, key: 'id'} },
  tuition: { type: Sequelize.INTEGER },
  status: { type: Sequelize.ENUM('paid', 'canceled', 'refunded') }
});