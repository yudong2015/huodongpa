
var findNoRepeatTeachersOfCouse = function(course){
  var teachers = {}
  var classes = course.Classes;
  for(var i=0; i<classes.length; i++) {
    teachers[classes[i].teacher.id] = classes[i].teacher;
  }

  return teachers;
}


exports.findNoRepeatTeachersOfCouse = findNoRepeatTeachersOfCouse;