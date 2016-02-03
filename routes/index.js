var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/courses')
});

router.use('/register', require('./register'));
router.use('/login', require('./login'));
router.use('/reset', require('./reset'));
router.use('/courses', require('./courses'));
router.use('/teachers', require('./teachers'));
router.use('/classes', require('./classes'));
router.use('/me', require('./me'));
router.use('/cards', require('./cards'));
router.use('/syllabus', require('./syllabus'));
router.use('/recommend', require('./recommend'));
router.use('/cart', require('./cart'));

router.use('/qiniu', require('./qiniu'));

module.exports = router;
