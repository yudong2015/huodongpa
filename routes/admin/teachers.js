var express = require('express');
var router = express.Router();

var Teacher = require('../../models').Teacher;
var Class = require('../../models').Class;
var Course = require('../../models').Course;
var Category = require('../../models').Category;

var path = require('path');
var jsonfile = require('jsonfile');

var conf = require('../../config');
// var conf = jsonfile.readFileSync(path.join(__dirname,"../../config.json"));

// teachers list
router.get('/', function (req, res, next) {
    var curpage = parseInt(req.query.curpage) || 0;
    var perpage = parseInt(req.query.perpage) || 10;
    var search = req.query.search || '';

    var showpage = 5;

    var conditions = {
        offset: curpage * perpage,
        limit: perpage,
        include: [
            {
                model: Class, as: 'Classes', include: [
                {
                    model: Course, include: [Category]
                }]
            }],
        order: [['id', 'DESC']]
    };
    req.session.manager.role == conf.default.managerRole.normal && (conditions.where = {
        managerId: req.session.manager.id
    });
    if (req.query.search) {
        var number = new RegExp("^[0-9]*$");
        if (number.test(search)) {
            conditions.where.id = {
                $eq: search
            }
        } else {
            conditions.where.name = {
                $like: '%' + search + '%'
            }
        }
    }
    console.log('====================')
    Teacher.findAndCountAll(conditions).then(function (teachers) {
        res.render('admin/teachers', {
            nav: 'teachers',
            user_: {username: req.session.manager.username, role: req.session.manager.role},
            teachers: teachers,
            stylesheets: [],
            javascripts: ['/admin/teachers.js'],
            search: search,
            pagination: {
                showpage: showpage,
                curpage: curpage,
                perpage: perpage,
                count: teachers.count,
                query: 'search=' + search
            }
        });
    }).catch(function (error) {
        console.log(error);
        next(error);
    });
});

// teacher create
router.get('/new', function (req, res, next) {
    res.render('admin/teacher', {
        nav: 'teachers',
        user_: {username: req.session.manager.username, role: req.session.manager.role},
        javascripts: ['/thirdparty/pupload/plupload.full.min.js', '/thirdparty/qiniu/qiniu.min.js', '/admin/teacher.js'],
        stylesheets: [],
        action: 'new',
        qiniuDomain: conf.qiniu.url
    });
});
var nodeExcel = require('excel-export');
/**
 * 批量导出教师表
 */
router.get('/export', function (req, res, next) {
    var conf = {};
    conf.stylesXmlFile = "styles.xml";
    conf.name = "教师数据";
    conf.cols = [
        {
            caption: 'ID',
            type: 'string',
            width: 20
        },
        {
            caption: '讲师名称',
            type: 'string',

        },
        {
            caption: '讲师头像',
            type: 'string'
        },
        {
            caption: '讲师简介',
            type: 'string'
        },
        {
            caption: '总盈利',
            type: 'string'
        }
    ];
    conf.rows = [];
    var attrs = ['id', 'name', 'avatar', 'description', 'createdAt', 'updatedAt'];
    Teacher.findAll({attributes: attrs}).then(function (teachers) {
        console.log(teachers)
        for(var i  = 0; i <teachers.length;i++){
            //teachers[i] = teachers[i]
            conf.rows.push([teachers[i].id, teachers[i].name, teachers[i].avatar, teachers[i].description,teachers[i].description]);
        }
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Teachers.xlsx");
        res.end(result, 'binary');
    });


});

// teacher create form action
router.post('/new', function (req, res, next) {
    req.body.managerId = req.session.manager.id;
    Teacher.create(req.body).then(function () {
        res.redirect('/admin/teachers');
    }).catch(function (error) {
        console.log(error);
        next(error);
    });
});

// teacher create
router.get('/edit', function (req, res, next) {
    Teacher.findById(req.query.id).then(function (teacher) {
        res.render('admin/teacher', {
            nav: 'teachers',
            user_: {username: req.session.manager.username, role: req.session.manager.role},
            javascripts: ['/thirdparty/pupload/plupload.full.min.js', '/thirdparty/qiniu/qiniu.min.js', '/admin/teacher.js'],
            stylesheets: [],
            action: 'edit',
            teacher: teacher,
            qiniuDomain: conf.qiniu.url
        });
    });
});

// teacher create form action
router.post('/edit', function (req, res, next) {

    Teacher.upsert(req.body).then(function () {
        res.redirect('/admin/teachers');
    }).catch(function (error) {
        console.log(error);
        next(error);
    });
});

// class delete
router.post('/delete', function (req, res, next) {
    Teacher.destroy({
        where: {id: req.body.id}
    }).then(function () {
        res.json({
            code: 0,
            message: "ok"
        });
    }).catch(function (error) {
        console.log(error);
        res.json({
            code: -1,
            message: error
        });
    });
});

// teacher detail
router.get('/detail', function (req, res, next) {
    var id = req.query.id;

    Teacher.findById(id, {
        include: [
            {
                model: Class, as: 'Classes', include: [
                {
                    model: Course, include: [Category]
                }]
            }],
    }).then(function (teacher) {
        // there is an issue in sequlize with nest include & aggregate, it's fixed but not released.
        // https://github.com/sequelize/sequelize/pull/5106
        // https://github.com/sequelize/sequelize/issues/5121
        // see I temporarily use js to find distinct courses.
        var courses = {};
        var categories = {};
        for (var i = 0; i < teacher.Classes.length; i++) {
            if (teacher.Classes[i].course) {
                courses[teacher.Classes[i].course.id] = teacher.Classes[i].course;

                categories[teacher.Classes[i].course.name] = true;
                categories[teacher.Classes[i].course.category.name] = true;
            }
        }
        res.render('admin/teacher-detail', {
            nav: 'teachers',
            user_: {username: req.session.manager.username, role: req.session.manager.role},
            stylesheets: [],
            javascripts: ['/admin/teacher-detail.js'],
            courses: courses,
            teacher: teacher,
            categories: categories
        });
    }).catch(function (error) {
        console.log(error);
        next(error);
    });
});

module.exports = router;
