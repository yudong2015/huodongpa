
var findNoRepeatTeachersOfCourse = function(course){
  var teachers = {}
  var classes = course.Classes;
  for(var i=0; i<classes.length; i++) {
    if(classes[i].teacher){
      teachers[classes[i].teacher.id] = classes[i].teacher;
    }
  }

  return teachers;
}


exports.findNoRepeatTeachersOfCourse = findNoRepeatTeachersOfCourse;