var Sequelize = require('../models').Sequelize;
var Manager = require('../models').Manager;
var Category = require('../models').Category;
var config = require('../config');
var utils = require('../lib');
// create database
console.log("PLEASE create databse 'activitypar' first before first execution!");
function createSuperManager (){
  var user = {username:config.admin.username,password:config.admin.password,role:'super'};
  user.password = utils.genDefaultPassword(user.password);
  Manager
      .upsert(user)
      .then(function(){
        console.log('Super Manager Create Successful !')
        createDefaultCategory();
      }).catch(function(error){
        console.log('Super Manager Create Failed :'+error);
      });

}
function createDefaultCategory(){
  //config.default.categorys;
  var categorys = [];
  config.default.categorys.forEach(function(item){
    categorys.push({
      name:item,
      type:config.default.catetoryType.common,
      managerId:1,
    });
  })
  Category.bulkCreate(categorys).then(function(){
    console.log('-- Create common Category successfully ! --');
  }).catch(function(err){
    console.log('-- Create common Category successfully : --'+err);
  });
}

// sync database schema
Sequelize.sync().then(function(){
  console.log("sync db ok.");

  Manager.find({
    where: {
      username: config.admin.username
    }
  }).then(function(user){
    if (user){
      var password = utils.genDefaultPassword(config.admin.password);
      if (user.role=='super' && password == user.password){
        console.log('���Ѿ������˳�������Ա�˻���');

      } else {
        createSuperManager();
      }
    } else {
      createSuperManager();
    }
  }).catch(function(error){
    console.log('ϵͳ��æ�����Ժ�����');
  });

}).catch(function(error){
  console.log("sync db error:" + error);
});
