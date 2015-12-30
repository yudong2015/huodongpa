var Sequelize = require("sequelize");

var orm = require("./orm");

var Category = require("./category");

module.exports = orm.define('course', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncreament: true },
  name: { type:Sequelize.STRING, allowNull: false},
  categoryId: { type: Sequelize.INTEGER, references: {model: Category, key: 'id'} },
  description: { type: Sequelize.TEXT }
});