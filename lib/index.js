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

exports.findNoRepeatTeachersOfCourse = findNoRepeatTeachersOfCourse;
exports.sortCoursesByPinyin = sortCoursesByPinyin;
