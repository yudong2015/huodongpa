/**
 * Manager 后台管理人员
 * Created by byte on 2016/5/21.
 */
var express = require('express');
var router = express.Router();

var _ = require('underscore');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');

var Manager = require('../../models').Manager;
var User = require('../../models').User;
var Teacher = require('../../models').Teacher;
var Class = require('../../models').Class;
var Order = require('../../models').Order;
var Course = require('../../models').Course;
var Category = require('../../models').Category;
var Recommend = require('../../models').Recommend;
var config = require('../../config');
var Promise = require('bluebird');
var utils = require('../../lib');

var path = require('path');
var jsonfile = require('jsonfile');

var conf = require('../../config');
// var conf = jsonfile.readFileSync(path.join(__dirname,"../../config.json"));

var DEFAULT_PASSWORD = "woaihuodongpa";


// admin login
router.get('/login', function(req, res, next) {
    res.render('admin/login', {error: null});
});
router.post('/login', function(req, res, next) {
    //supermanager
    var data = {};

    if(req.body.supermanager){
        if(req.body.username == config.admin.username && req.body.password == config.admin.password){
            req.session.manager = {username:'admin',role:'super'};
            res.redirect('/admin');
        } else {
            res.render('admin/login', {error: '管理员用户名或密码错误，请确认您是否是超级管理员账户！'});
        }
    }else{

        Manager.find({
            where: {
                username: req.body.username
            }
        }).then(function(user){
            if (user){
                var md5 = crypto.createHash('md5');
                var password = md5.update(req.body.password).digest('base64');
                if (password == user.password){
                    req.session.manager = user;
                    return res.redirect('/admin');
                } else {
                    data.error = '密码错误';
                    return res.render('admin/login', data);
                }
            } else {
                data.error = '用户名不存在';
                return res.render('admin/login', data);
            }
        }).catch(function(error){
            console.log(error);
            data.error = '系统繁忙，请稍后再试';
            return res.render('admin/login', data);
        });
    }
});

// admin logout
router.get('/logout', function(req, res, next) {
    delete req.session.manager;
    res.redirect('/admin/managers/login');
});

router.get('/', function(req, res, next) {
    var curpage = parseInt(req.query.curpage) || 0;
    var perpage = parseInt(req.query.perpage) || 10;
    var search = req.query.search || '';

    var showpage = 5;

    var conditions = {
        offset: curpage * perpage,
        limit: perpage,
        order: [['id', 'DESC']]
    };

    if (req.query.search) {
        var number = new RegExp("^[0-9]*$");
        if(number.test(search)) {
            conditions.where = {
                username : {
                    $eq: search
                }
            }
        } else {
            conditions.where = {
                name : {
                    $like: '%' + search + '%'
                }
            }
        }
    }

    Manager.findAndCountAll(conditions).then(function(users) {
        res.render('admin/managers', {
            nav: 'managers',
            stylesheets: [],
            user_:{username:req.session.manager.username,role:req.session.manager.role},
            javascripts: ['/thirdparty/pupload/plupload.full.min.js', '/thirdparty/qiniu/qiniu.min.js','/admin/managers.js'],
            users: users,
            search: search,
            qiniuDomain: conf.qiniu.url,
            pagination: {
                showpage : showpage,
                curpage: curpage,
                perpage: perpage,
                count: users.count,
                query: 'search=' + search
            }
        });
    }).catch(function(error){
        console.log(error);
        next(err);
    });
});

router.get('/new', function(req, res, next) {
    res.render('admin/manager', {
        nav: 'users',
        user_:{username:req.session.manager.username,role:req.session.manager.role},
        stylesheets: [],
        javascripts: []
    });
});

function genDefaultPassword(){
    var md5 = crypto.createHash('md5');
    return md5.update(DEFAULT_PASSWORD).digest('base64');
}

router.post('/new', function(req, res, next) {
    var user = _.clone(req.body);
    user.password = genDefaultPassword();
    Manager
        .upsert(user)
        .then(function(){
            res.redirect('/admin/managers');
        }).catch(function(error){
            console.log(error);
            next(error);
        });
});

router.get('/detail', function(req, res, next) {
    var curpage = parseInt(req.query.curpage) || 0;
    var perpage = parseInt(req.query.perpage) || 10;
    var showpage = 5;
    var subnav = req.query.sub || 'history';

    var conditions = {
        offset: curpage * perpage,
        limit: perpage,
        order: [['id', 'DESC']],
        where: {
            status: subnav == 'history' ? 'paid' : 'unpaid',
            userId: req.query.id
        },
        include : [
            {
                model: Class,
                include: [Teacher, {
                    model: Course,
                    include: Category
                }]
            }
        ]
    };


    Promise.all([Manager.findById(req.query.id), Order.findAndCountAll(conditions)])
        .then(function(results){
            var user = results[0];
            var orderResult = results[1];

            res.render('admin/manager-detail', {
                nav: 'users',
                stylesheets: [],
                user_:{username:req.session.manager.username,role:req.session.manager.role},
                javascripts: ['/admin/manager-detail.js'],
                orders: orderResult.rows,
                user: user,
                sub: subnav,
                pagination: {
                    showpage : showpage,
                    curpage: curpage,
                    perpage: perpage,
                    count: orderResult.count,
                    query: 'id=' + req.query.id + '&sub=' + subnav
                }
            });
        }).catch(function(error){
            console.log(error);
            next(error);
        });

});

router.get('/recommends', function(req, res, next) {
    var curpage = parseInt(req.query.curpage) || 0;
    var perpage = parseInt(req.query.perpage) || 10;
    var showpage = 5;
    var subnav = req.query.sub || 'recommended';

    var conditions = {
        offset: curpage * perpage,
        limit: perpage,
        order: [['id', 'DESC']],
        where: {
            userId: req.query.id
        }
    };


    Promise.all([Manager.findById(req.query.id), Recommend.findAndCountAll(conditions)])
        .then(function(results){
            var user = results[0];
            var recommendResult = results[1];

            res.render('admin/manager-detail', {
                nav: 'users',
                user_:{username:req.session.manager.username,role:req.session.manager.role},
                stylesheets: [],
                javascripts: ['/admin/manager-detail.js'],
                recommends: recommendResult.rows,
                user: user,
                sub: subnav,
                pagination: {
                    showpage : showpage,
                    curpage: curpage,
                    perpage: perpage,
                    count: recommendResult.count,
                    query: 'id=' + req.query.id
                }
            });
        }).catch(function(error){
            console.log(error);
            next(error);
        });
});

router.get('/info', function(req, res, next) {
    var userid = req.query.id;

    var user = {};

    Manager.findById(userid).then(function(result){
        user.id = result.id;
        user.name = result.name;
        user.username = result.username;

        console.log(user);

        return Order.findAll({
            where: {
                userId: user.id
            },
            include: Class
        });

    }).then(function(orders){
        var total = 0;
        if(orders){


            for(var i=0; i<orders.length; i++) {
                if((utils.getClassStatus(orders[i]['class']) == 'inclass') || (utils.getClassStatus(orders[i]['class']) == 'end')){
                    total += orders[i].tuition;
                }
            }
        }

        res.json({
            code: 0,
            data: {
                id: user.id,
                name: user.name || '无名氏',
                username: user.username,
                total: total
            }
        });
    }).catch(function(error){
        console.log(error);
        next(error);
    });
});

router.post('/recommend', function(req, res, next) {
    var id = req.query.id;

    Recommend.findById(id).then(function(recommend){
        recommend.rewarded = req.body.rewarded;
        return recommend.save();
    }).then(function(){
        res.json({
            code: 0
        })
    }).catch(function(error){
        console.log(error);
        res.json({
            code: -1,
            message: error
        });
    });
});

router.post('/qrcode', function(req, res, next) {
    var id = req.query.id;

    Manager.findById(id).then(function(user){
        user.gatheringQrcode = req.body.qrcode;
        return user.save();
    }).then(function(){
        res.json({
            code: 0
        });
    }).catch(function(error){
        console.log(error);
        res.json({
            code: -1,
            message: error
        });
    });
});

router.get('/search', function(req, res, next) {
    var keyword = req.query.q;

    Manager.findAll({
        attributes: ['id', 'username', 'name'],
        where: {
            $or: [
                {
                    username: {
                        $like: '%'+keyword+'%'
                    }
                },
                {
                    name: {
                        $like: '%'+keyword+'%'
                    }
                }
            ]
        }
    }).then(function(users) {
        res.json({
            code: 0,
            data: users
        })
    }).catch(function(error){
        console.log(error);
        res.json({
            code: -1,
            message: error
        });
    });
});

module.exports = router;
