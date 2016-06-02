var pinyin = require("pinyin");
var crypto = require('crypto');
var config = require('../config');
var findNoRepeatTeachersOfCourse = function(course) {
  var teachers = {}
  if(course){
    var classes = course.Classes;
    for(var i=0; i<classes.length; i++) {
      if(classes[i].teacher){
        teachers[classes[i].teacher.id] = classes[i].teacher;
      }
    }
  }

  return teachers;
};

var sortNameByPinyin = function(objs) {
  for (var i=0; i<objs.length; i++) {

   // if(objs[i].name instanceof  Array){
   // console.log(objs[i].name)
      objs[i].pinyin = pinyin(objs[i].name)[0][0].toUpperCase();
    /*}else{
      console.log('t----')
    }
*/
  }

  objs.sort(function(a, b) {
    return a.pinyin<b.pinyin?-1:1;
  });


  var pinyins = [];
  for (var i=0; i<objs.length; i++) {
    pinyins.push(objs[i].pinyin);
  }

  return pinyins;
};

var hanzDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

var splitClassDates = function(dates) {
  var dateArr = dates.split(',');
  dateArr.sort();
  for(var i=0; i<dateArr.length; i++) {
    var yyyy = dateArr[i].substr(0, 4);
    var mth = dateArr[i].substr(4, 2);
    var dd = dateArr[i].substr(6, 2);
    var date = new Date(yyyy, mth-1, dd);
    var day = hanzDay[date.getDay()];
    dateArr[i] = yyyy + '.' + mth + '.' + dd + '（' + day + '）';
  }
  return dateArr;
};

var getClassStatus = function(clas) {
  var dates =  clas.classDates.split(',');
  dates.sort();

  var beginDate = parseInt(dates[0]);
  var endDate = parseInt(dates[dates.length - 1]);

  if(clas.status == 'canceled') {
    return 'canceled';
  }

  var curday = new Date();
  var today = curday.getFullYear()*10000 + (curday.getMonth()+1)*100 + curday.getDate();

  if(today < clas.registerDate) {
    return 'preregister';
  } else if (today >= clas.registerDate && today < beginDate) {
    return 'register';
  } else if (today >= beginDate && today <= endDate) {
    return 'inclass';
  } else if (today > endDate){
    return 'end';
  } else {
    return 'unkown';
  }
};

var getDatesOfYearQuarter = function(year, quarter) {
  var beginDate;
  var endDate;

  if(year == 65535){
    beginDate = new Date(2000, 0, 1, 8);
    endDate = new Date(2038, 0 , 1, 8);
  } else if(quarter == 65535) {
    beginDate = new Date(year, 0, 1, 8);
    endDate = new Date(year+1, 0 , 1, 8);
  } else {
    beginDate = new Date(year, quarter*3, 1, 8);
    endDate = new Date(year, (quarter+1)*3, 1, 8);
  }

  return {
    begin: beginDate,
    end: endDate
  }
};

var getUserClassesByMonth = function(orders, year, month) {
  var classes = {};
  if(month.length < 2) {
    month = '0' + month;
  }
  var beginDate = year + month + '00';
  var endDate = year + month + '32';

  for(var i=0; i<orders.length; i++) {
    var clas = orders[i]['class'];
    var dates =  clas.classDates.split(',');
    for(var j=0; j<dates.length; j++) {
      if(beginDate < dates[j] && endDate > dates[j]) {
        var dd = dates[j].substr(6, 2);
        if(!classes[parseInt(dd)]){
          classes[parseInt(dd)] = {};
        }
        classes[parseInt(dd)][clas.id] = clas;
      }
    }
  }

  console.log(JSON.stringify(classes));
  return classes;
};
var genDefaultPassword = function (password){
  password = password||config.default.password;
  var md5 = crypto.createHash('md5');
  return md5.update(password).digest('base64');
};


module.exports.genDefaultPassword = genDefaultPassword;
exports.findNoRepeatTeachersOfCourse = findNoRepeatTeachersOfCourse;
exports.sortNameByPinyin = sortNameByPinyin;
exports.splitClassDates = splitClassDates;
exports.getClassStatus = getClassStatus;
exports.getDatesOfYearQuarter = getDatesOfYearQuarter;
exports.getUserClassesByMonth = getUserClassesByMonth;

