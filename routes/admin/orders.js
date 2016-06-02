var express = require('express');
var router = express.Router();

var Class = require('../../models').Class;
var Course = require('../../models').Course;
var Category = require('../../models').Category;
var Teacher = require('../../models').Teacher;
var Order = require('../../models').Order;
var User = require('../../models').User;

var Promise = require('bluebird');
var _ = require('underscore');
var json2csv = require('json2csv');
var moment = require('moment');


router.get('/', function(req, res, next){
  // res.render('admin/orders');

  var clasId = req.query.clas;

  var curpage = parseInt(req.query.curpage) || 0;
  var perpage = parseInt(req.query.perpage) || 10;

  var showpage = 5;

  var conditions = {
    offset: curpage * perpage,
    limit: perpage,
    where: {classId: clasId},
    include: [User],
    order: [['id', 'DESC']]
  };
 
  Promise.all([
    Class.findById(clasId, {include: [
      Course, 
      Teacher,
      {
        model: Order,
        as : 'Orders'
      }
    ]}), 
    Order.findAndCountAll(conditions)
  ]).then(function(result){
    var clas = result[0];
    var orders = result[1];
    res.render('admin/orders', {
      nav: 'courses',
      user_:{username:req.session.manager.username,role:req.session.manager.role},
      clas: clas,
      orders: orders,
      stylesheets: [],
      javascripts: ['/thirdparty/bootstrap-typeahead/typeahead.jquery.min.js','/admin/order.js'],
      pagination: {
        showpage : showpage,
        curpage: curpage,
        perpage: perpage,
        count: orders.count,
        query: 'clas=' + clasId
      }
    });
  }).catch(function(error){
    console.log(error);
    next(error);
  });

});

router.post('/add', function(req, res, next) {
  Class
    .findById(req.body.classId)
    .then(function(clas){
      var order = _.clone(req.body);
      order.tuition = clas.tuition;
      order.status = 'paid';
      return Order.upsert(order);
    }).then(function() {
      res.redirect('/admin/orders?clas=' + req.body.classId);
    }).catch(function(err) {
      console.log(err);
      next(err);
    });
  
});

router.post('/cancel', function(req, res, next) {
  Order
    .findById(req.body.id)
    .then(function(order){
      order.status = 'canceled';
      return order.save();
    }).then(function() {
      res.json({
        code : 0
      })
    }).catch(function(err) {
      console.log(err);
      res.json({
        code: -1,
        message: err
      });
    });
  
});

router.post('/recover', function(req, res, next) {
  Order
    .findById(req.body.id)
    .then(function(order){
      order.status = 'paid';
      return order.save();
    }).then(function() {
      res.json({
        code : 0
      })
    }).catch(function(err) {
      console.log(err);
      res.json({
        code: -1,
        message: err
      });
    });
  
});

router.post('/buy', function(req, res, next) {
  var orderids = req.body.id.split(',');

  Order.update(
    {status: 'paid'},
    {
      where: {
        id: {
          $in: orderids
        }
      }
    }
  ).then(function(){
    res.json({
      code : 0
    })
  }).catch(function(err) {
    console.log(err);
    res.json({
      code: -1,
      message: err
    });
  });
});


router.post('/delete', function(req, res, next) {
  var orderids = req.body.id.split(',');

  Order.destroy(
    {
      where: {
        id: {
          $in: orderids
        }
      }
    }
  ).then(function(){
    res.json({
      code : 0
    })
  }).catch(function(err) {
    console.log(err);
    res.json({
      code: -1,
      message: err
    });
  });
});

router.get('/:clasId/download', function(req, res, next) {
    var clasId = req.params.clasId;

    Order.findAll({
        where: {classId: clasId},
        include: [User],
        order: [['id', 'DESC']]
    }).then(function(result) {
        var orders = result;
        userInfo = _.map(orders, function(item, i){
            return {
                '账号': item.user.username,
                '姓名': item.user.name,
                '紧急电话': item.user.emergencyPhone,
                '地址': item.user.address,
                '学费': item.tuition,
                '购课日期': moment(item.user.updatedAt).format('YYYY-MM-DD'),
                    '状态': item['status'] == 'paid' ? '已付款' :  '未付款'
            };
        });
      
        res.xls(clasId + '.xlsx', userInfo||[]);

        /*
        fieldCsv = ['账号', '姓名', '紧急电话', '地址', '学费', '购课日期', '状态'];
        userInfoCsv = json2csv({data: userInfo, fields: fieldCsv}, function(err, csv){
            if (err) {
                console.log(err);
                res.send('')
            }

            // 设置 header 使浏览器下载文件
            res.setHeader('Content-Description', 'File Transfer');
            res.setHeader('Content-Type', 'application/csv; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename=' + clasId + '.csv');
            res.setHeader('Expires', '0');
            res.setHeader('Cache-Control', 'must-revalidate'); 
            
            res.send("\uFEFF" + csv);
        });
        */
    
    }).catch(function(error) {
        console.log(error);
        next(error);
    
    });

    
});

module.exports = router;
