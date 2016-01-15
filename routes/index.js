var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.session.user });
});

router.use('/register', require('./register'));
router.use('/login', require('./login'));
router.use('/reset', require('./reset'));
router.use('/courses', require('./courses'));
router.use('/classes', require('./classes'));
router.use('/me', require('./me'));
router.use('/cards', require('./cards'));
//router.use('/cart', require('./cart'));

router.use('/qiniu', require('./qiniu'));

module.exports = router;
