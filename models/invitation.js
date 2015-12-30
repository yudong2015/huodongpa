var Sequelize = require("sequelize");

var orm = require("./orm");

var User = require("./user");

module.exports = orm.define('invitation', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncreament: true },
  inviterId: { type:Sequelize.INTEGER, references: {model: User, key: 'id'} },
  inviteeId: { type: Sequelize.INTEGER, references: {model: User, key: 'id'} }
});