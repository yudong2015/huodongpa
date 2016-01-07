var Sequelize = require("sequelize");

var orm = require("./orm");

var Category = orm.define('category', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
  name: { type:Sequelize.STRING, allowNull: false },
  abbreviation: { type:Sequelize.STRING},
  description: { type:Sequelize.TEXT }
}, {
  charset: 'utf8'
});

var Teacher = orm.define('teacher', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type:Sequelize.STRING, allowNull: false },
  avatar: { type:Sequelize.STRING, allowNull: false },
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
  status: { type: Sequelize.ENUM('normal', 'canceled'), defaultValue: 'normal', allowNull: false},
  minStudentsNumber: { type: Sequelize.INTEGER, allowNull: false },
  maxStudentsNumber: { type: Sequelize.INTEGER, allowNull: false }
}, {
  initialAutoIncrement: 100001,
  charset: 'utf8'
});

var Course = orm.define('course', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type:Sequelize.STRING, allowNull: false},
  categoryId: { type: Sequelize.INTEGER, allowNull: false},
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
  avatar: { type: Sequelize.STRING },
  address: { type: Sequelize.STRING },
  gatheringQrcode: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING },
  birthday: { type: Sequelize.DATE },
  school: { type: Sequelize.STRING },
  grade: { type: Sequelize.STRING },
  emergencyPhone: { type: Sequelize.STRING }
}, {
  charset: 'utf8'
});

var Order = orm.define('order', {
  id: { type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  classId: { type:Sequelize.INTEGER, references: {model: Class, key: 'id'} },
  UserId: { type: Sequelize.INTEGER, references: {model: User, key: 'id'} },
  tuition: { type: Sequelize.INTEGER },
  status: { type: Sequelize.ENUM('unpaid', 'paid', 'canceled', 'refunded') }
}, {
  initialAutoIncrement: 1000001,
  charset: 'utf8'
});


Teacher.hasMany(Class, {as: 'Classes'});
Class.belongsTo(Teacher, {onDelete: 'NO ACTION'});
Class.belongsTo(Course, {onDelete: 'NO ACTION'});
Course.belongsTo(Category, {onDelete: 'NO ACTION'});
Course.hasMany(Class, {as: 'Classes'});

exports.Category = Category;
exports.Class= Class;
exports.Course = Course;
exports.Teacher= Teacher;
exports.Order= Order;
exports.User = User;

exports.Sequelize = orm;