var pinyin = require("pinyin");

var findNoRepeatTeachersOfCourse = function(course) {
  var teachers = {}
  var classes = course.Classes;
  for(var i=0; i<classes.length; i++) {
    if(classes[i].teacher){
      teachers[classes[i].teacher.id] = classes[i].teacher;
    }
  }

  return teachers;
}

var sortNameByPinyin = function(objs) {
  for (var i=0; i<objs.length; i++) {
    objs[i].pinyin = pinyin(objs[i].name)[0][0].toUpperCase();
  }

  objs.sort(function(a, b) {
    return a.pinyin<b.pinyin?-1:1;
  });


  var pinyins = [];
  for (var i=0; i<objs.length; i++) {
    pinyins.push(objs[i].pinyin);
  }

  return pinyins;
}

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
}

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
  } else if (today >= clas.registerDate && today <= beginDate) {
    return 'register';
  } else if (today > beginDate && today <= endDate) {
    return 'inclass';
  } else if (today > endDate){
    return 'end';
  } else {
    return 'unkown';
  }
}

exports.findNoRepeatTeachersOfCourse = findNoRepeatTeachersOfCourse;
exports.sortNameByPinyin = sortNameByPinyin;
exports.splitClassDates = splitClassDates;
exports.getClassStatus = getClassStatus;

