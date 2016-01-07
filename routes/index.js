var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/register', require('./register'));
router.use('/qiniu', require('./qiniu'));

module.exports = router;
