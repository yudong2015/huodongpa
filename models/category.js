var Sequelize = require("sequelize");

var orm = require("./orm");

module.exports = orm.define('category', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncreament: true },
  name: { type:Sequelize.STRING, allowNull: false },
  abbreviation: { type:Sequelize.STRING},
  description: { type:Sequelize.TEXT }
});