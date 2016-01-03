var express = require('express');
var router = express.Router();

var User = require('../../models').User;

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

  User.findAndCountAll(conditions).then(function(users) {
    res.render('admin/users', {
      nav: 'users',
      stylesheets: [],
      javascripts: [],
      users: users,
      search: search,
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
    res.render('error', {
      message: error,
      error: {}
    });
  });
});

module.exports = router;