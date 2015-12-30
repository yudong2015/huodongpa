var Sequelize = require("sequelize");

var orm = require("./orm");

module.exports = orm.define('teacher', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncreament: true },
  name: { type:Sequelize.STRING, allowNull: false },
  avatar: { type:Sequelize.STRING, allowNull: false },
  description: { type:Sequelize.TEXT, allowNull: false }
});