var Sequelize = require("sequelize");

var orm = require("./orm");

module.exports = orm.define('user', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  name: { type: Sequelize.STRING },
  openid: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING },
  address: { type: Sequelize.STRING },
  gatheringQrcode: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING },
  birthday: { type: Sequelize.DATE },
  school: { type: Sequelize.STRING },
  grade: { type: Sequelize.STRING },
  emergencyPhone: { type: Sequelize.STRING }
});