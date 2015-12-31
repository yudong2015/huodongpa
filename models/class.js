var Sequelize = require("sequelize");

var orm = require("./orm");

var Teacher = require("./teacher");

module.exports = orm.define('class', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  teacherId: { type: Sequelize.INTEGER, references: {model: Teacher, key: 'id'} },
  registerDate: { type: Sequelize.DATE, allowNull: false },
  beginDate: { type: Sequelize.DATE, allowNull: false },
  endDate: { type: Sequelize.DATE, allowNull: false },
  beginTime: { type: Sequelize.STRING, allowNull: false },
  endTime: { type: Sequelize.STRING, allowNull: false },
  address: { type: Sequelize.STRING, allowNull: false },
  tuition: { type: Sequelize.INTEGER, allowNull: false },
  period: { type: Sequelize.INTEGER, allowNull: false },
  status: { type: Sequelize.ENUM('normal', 'canceled'), defaultValue: 'normal', allowNull: false},
  minStudentsNumber: { type: Sequelize.INTEGER, allowNull: false },
  maxStudentsNumber: { type: Sequelize.INTEGER, allowNull: false }
});