var express = require('express');
var router = express.Router();

var _ = require('underscore');
var Promise = require('bluebird');
var utils = require("../lib/");
var moment = require('moment');
var Course = require('../models').Course;
var Category = require('../models').Category;
var Teacher = require('../models').Teacher;
var Manager = require('../models').Manager;
var Class = require('../models').Class;

var renderConf = {
    tips: '',
    title: '活动列表-活动葩',
    style: 'teacher',
    page: 'course'
};

router.get('/', function (req, res, next) {

    var search = req.query.search || '';
    var region = req.query.region || '';
    var type = req.query.type || '';
    var price = req.query.price || '';
    var interval = req.query.interval || '';
    var org = req.query.org || '';

    var name = req.query.name || '';


    var conditions = {
        include: [
            {
                model: Category,
            },
            {
                model: Class,
                as: 'Classes',
            },
            Manager,
        ],
        where: {}
    };
    if (search) {
        conditions.where.name = {
            $like: '%' + search + '%'
        }
    }
    if (price) {
        var price_ = price.split('-');
        var filter = {
            tuition: {}
        };
        if (price.length > 2) {
            filter.tuition.$lt = parseInt(price_[2]);
            filter.tuition.$gt = parseInt(price_[0]);
        } else {
            filter.tuition.$gt = parseInt(price_[0]);
        }

        conditions.include[1].where = filter;
    }
    if (interval) {
        var date_unit = 24 * 60 * 60 * 1000, date_format = 'YYYYMMDD';
        var filter = {};
        var interval_ = {
            today: function () {
                return moment(Date.now()).format(date_format);
            },
            tomorrow: function () {
                return moment(Date.now() + date_unit).format(date_format);
            },
            recentweek: function () {
                return moment(Date.now() + 7 * date_unit).format(date_format);
            },
            recentmonth: function () {
                return moment(Date.now() + 30 * date_unit).format(date_format)
            }
        };
        if (interval == 'today') {
            filter.classDates = {
                $eq: interval_.today()
            };
            interval = '今天';
        } else if (interval == 'tomorrow') {
            filter.classDates = {
                $eq: interval_.tomorrow()
            };
            interval = '明天';
        } else if (interval == 'recentweek') {
            filter.classDates = {
                $gt: moment(Date.now()).format(date_format),
                $lt: interval_.recentweek(),
            };
            interval = '最近一周';
        } else if (interval == 'recentmonth') {
            filter.classDates = {
                $gt: moment(Date.now()).format(date_format),
                $lt: interval_.recentmonth(),
            };
            interval = '最近一月';
        }
        conditions.include[1].where = filter;
    }
    if (org) {
        conditions.where.managerId = org;
    }
    if (type) {
        conditions.where.categoryId = type;
    }

    if (region) {
        console.log('=========================')
        console.log(region)
        conditions.include[1].where = {};
        conditions.include[1].where.address = {
            $like: '%' + region + '%'
        };
    }

    var data = _.extend(req.query, renderConf);

    data.user = req.session.user;

    Promise.join(Course.findAndCountAll(conditions), Category.findAll(), Manager.findAll(), function (courses, categories, managers) {

        console.log(JSON.stringify(courses.rows));

        if (type) {
            categories.forEach(function (item, index) {
                if (item.id == type) {
                    type = item.name;
                }
            });
        }
        if (org) {
            managers.forEach(function (item, index) {
                if (item.id == org) {
                    org = item.org
                }
                ;
            })
        }
        var pinyin = utils.sortNameByPinyin(courses.rows);
        data.courses = courses.rows;
        data.categories = categories;
        data.managers = managers;
        data.count = courses.count;
        data.name = name;
        data.query = {
            org: org,
            type: type,
            interval: interval,
            price: price,
            region:region,
        };
        data.pinyin = pinyin;
        data.search = search;
        //  console.log(JSON.stringify(data))
        res.render('courses', data);
    }).catch(function (error) {
        console.log(error);
        next(error);
    });

});

module.exports = router;
