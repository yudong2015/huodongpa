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

var sortCoursesByPinyin = function(courses) {
  for (var i=0; i<courses.length; i++) {
    courses[i].pinyin = pinyin(courses[i].name)[0][0].toUpperCase();
  }

  courses.sort(function(a, b) {
    return a.pinyin<b.pinyin?-1:1;
  });


  var pinyins = [];
  for (var i=0; i<courses.length; i++) {
    pinyins.push(courses[i].pinyin);
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

exports.findNoRepeatTeachersOfCourse = findNoRepeatTeachersOfCourse;
exports.sortCoursesByPinyin = sortCoursesByPinyin;
exports.splitClassDates = splitClassDates;
