var express = require('express');
var router = express.Router();

var Course = require('../../models').Course;
var Class = require('../../models').Class;
var Order = require('../../models').Order;

var lib = require('../../lib');

router.get('/course', function(req, res, next) {
  var courseid = req.query.id;
  var year = parseInt(req.query.year);
  var quarter = parseInt(req.query.quarter);

  var dates = lib.getDatesOfYearQuarter(year, quarter);

  Course.findById(courseid, {
    include: {
      model: Class,
      as: "Classes",
      include: {
        model: Order,
        as : "Orders",
        where: {
          status: 'paid',
          updatedAt: {
            $lt: dates.end,
            $gte: dates.begin
          }
        }
      }
    }
  }).then(function(course){

    console.log(JSON.stringify(course))
    var total = 0;

    if(course){
      for(var i=0; i<course.Classes.length; i++) {
        for(var j=0; j<course.Classes[i].Orders.length; j++) {
          total += course.Classes[i].Orders[j].tuition;
        }
      }
    }

    res.json({
      code : 0,
      data: total
    })
  }).catch(function(err) {
    console.log(err);
    res.json({
      code: 1,
      message: err
    });
  });
});

module.exports = router;