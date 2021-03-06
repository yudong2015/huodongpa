var Sequelize = require("sequelize");

var orm = require("./orm");
var config =  require('../config');
var util = require('../lib');

var Category = orm.define('category', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
  name: { type:Sequelize.STRING, allowNull: false },
  abbreviation: { type:Sequelize.STRING},
  type:{type:Sequelize.ENUM(config.default.catetoryType.common,config.default.catetoryType.special),
    defaultValue: config.default.catetoryType.special}, //基础类别、用户添加类别
  managerId:{type:Sequelize.INTEGER,allowNull:false},
  description: { type:Sequelize.TEXT }
}, {
  charset: 'utf8'
});

var Teacher = orm.define('teacher', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type:Sequelize.STRING, allowNull: false },
  avatar: { type:Sequelize.STRING, allowNull: false },
  managerId:{type:Sequelize.INTEGER,allowNull:false},
  description: { type:Sequelize.TEXT, allowNull: false }
}, {
  initialAutoIncrement: 1001,
  charset: 'utf8'
});

var Class = orm.define('class', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  registerDate: { type: Sequelize.INTEGER, allowNull: false},
  classDates: { type: Sequelize.STRING, allowNull: false },
  beginTime: { type: Sequelize.STRING, allowNull: false },
  endTime: { type: Sequelize.STRING, allowNull: false },
  address: { type: Sequelize.STRING, allowNull: false },
  tuition: { type: Sequelize.INTEGER, allowNull: false },
  period: { type: Sequelize.INTEGER, allowNull: false },
  count: { type: Sequelize.INTEGER, allowNull: false , defaultValue: 0,comment:'被查看次数统计'},
  status: { type: Sequelize.ENUM('normal', 'canceled'), defaultValue: 'normal', allowNull: false},
  minStudentsNumber: { type: Sequelize.INTEGER, allowNull: false },
  maxStudentsNumber: { type: Sequelize.INTEGER, allowNull: false },
  showInFrontEnd: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}
}, {
  initialAutoIncrement: 100001,
  charset: 'utf8'
});

var Course = orm.define('course', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type:Sequelize.STRING, allowNull: false},
  avatar: { type:Sequelize.STRING, allowNull: false },
  categoryId: { type: Sequelize.INTEGER, allowNull: false},
  managerId:{type:Sequelize.INTEGER,allowNull:false},
  description: { type: Sequelize.TEXT }
}, {
  initialAutoIncrement: 10001,
  charset: 'utf8'
});

var User = orm.define('user', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.STRING, allowNull: false },
  name: { type: Sequelize.STRING },
  openid: { type: Sequelize.STRING },
  managerId:{type:Sequelize.INTEGER,allowNull:false},
  avatar: { type: Sequelize.STRING },
  address: { type: Sequelize.STRING },
  gatheringQrcode: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING },
  birthday: { type: Sequelize.STRING },
  school: { type: Sequelize.STRING },
  grade: { type: Sequelize.STRING },
  emergencyPhone: { type: Sequelize.STRING }
}, {
  charset: 'utf8'
});
var Manager = orm.define('manager', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.STRING, allowNull: false },
  name: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING },
  role: { type: Sequelize.ENUM(config.default.managerRole.super, config.default.managerRole.normal) },
  status:{type:Sequelize.ENUM(config.default.isDeleted.deleted,config.default.isDeleted.normal)},
  address: { type: Sequelize.STRING },
  org: { type: Sequelize.STRING },
  region: { type: Sequelize.STRING },
  phone: { type: Sequelize.STRING }
}, {
  charset: 'utf8'
});
var Order = orm.define('order', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  classId: { type:Sequelize.INTEGER, references: {model: Class, key: 'id'}, unique: 'classuser' },
  userId: { type: Sequelize.INTEGER, references: {model: User, key: 'id'}, unique: 'classuser' },
  tuition: { type: Sequelize.INTEGER },
  status: { type: Sequelize.ENUM('unpaid', 'paid', 'canceled', 'refunded') }
}, {
  initialAutoIncrement: 1000001,
  charset: 'utf8'
});

var Recommend = orm.define('recommend', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type:Sequelize.INTEGER, references: {model: User, key: 'id'}, unique: 'recommend' },
  recommended: { type:Sequelize.INTEGER, references: {model: User, key: 'id'}, unique: 'recommend' },
  rewarded: { type:Sequelize.INTEGER, defaultValue: 0}
}, {
  charset: 'utf8'
});


Teacher.hasMany(Class, {as: 'Classes'});
User.hasMany(Order, {as: 'Orders'});
Manager.hasMany(User, {as: 'Users'});
Manager.hasMany(Teacher, {as: 'Teachers'});
Manager.hasMany(Category, {as: 'Categorys'});
Manager.hasMany(Course, {as: 'Courses'});
User.belongsTo(Manager,{onDelete:'NO ACTION'});
Teacher.belongsTo(Manager,{onDelete:'NO ACTION'});
Category.belongsTo(Manager,{onDelete:'NO ACTION'});
Course.belongsTo(Manager,{onDelete:'NO ACTION'});

Class.belongsTo(Teacher, {onDelete: 'NO ACTION'});
Class.belongsTo(Course, {onDelete: 'NO ACTION'});

Course.belongsTo(Category, {onDelete: 'NO ACTION'});

Course.hasMany(Class, {as: 'Classes'});
Order.belongsTo(Class, {onDelete: 'CASCADE'});
Order.belongsTo(User, {onDelete: 'NO ACTION'});
Class.hasMany(Order, {as: 'Orders'});
User.hasMany(Recommend, {as: 'Recommends'});


exports.Category = Category;
exports.Class= Class;
exports.Course = Course;
exports.Teacher= Teacher;
exports.Order= Order;
exports.User = User;
exports.Manager = Manager;
exports.Recommend = Recommend;

exports.Sequelize = orm;