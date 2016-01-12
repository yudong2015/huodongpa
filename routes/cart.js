var express = require('express');
var router = express.Router();

var errors = require('../lib/errors');

var Class = require('../models').Class;

router.post("/add", function(req, res, next) {
  var classid = req.body.id;
  if (!classid){
    return res.json(errors.ERR_WRONGARG);
  }

  console.log(classid);

  if( !req.session.cart ) {
    req.session.cart = {};
  }

  Class.findById(classid).then(function(clas){
    req.session.cart[classid] = clas;
    console.log(req.session.cart)
    res.json(errors.OK);
  }).catch(function(err){
    console.log(err);
    res.json(errors.ERR_CLASSNOTFOUND);
  });
});

module.exports = router;