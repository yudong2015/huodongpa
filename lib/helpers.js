var utils = require("./index");

var locals = {};

locals.splitClassDates = utils.splitClassDates;

locals.getClassStatus = utils.getClassStatus;

var colors = ['red', 'purple', 'blue', 'green', 'orange'];

locals.pickLabelColor = function(id) {
  return colors[id%5];
}


locals.formatDate = function(date) {
  return date.getFullYear() + '.' +  (date.getMonth()+1) + '.' + date.getDate();
}

locals.countPaidOrders = function(orders) {
  console.log(orders);
  if (!orders){
    return 0;
  }
  var cnt = 0;
  for(var i=0; i<orders.length; i++) {
    if(orders[i].status == 'paid'){
      cnt ++;
    }
  }

  return cnt;
}

locals.findCategoriesOfTeacher = function(teacher){
  var categories = {};
  for(var i=0; i<teacher.Classes.length; i++) {
    categories[teacher.Classes[i].course.category.id] = teacher.Classes[i].course.category;
  }
  return categories;
}

locals.findCoursesOfTeacher = function(teacher){
  var courses = {};
  for(var i=0; i<teacher.Classes.length; i++) {
    courses[teacher.Classes[i].course.id] = teacher.Classes[i].course;
  }
  return courses;
}

locals.checkClassConflict =function(){}

locals.compareDateWithToday = function(date) {
  return (date.getTime() - (new Date().getTime()))/86400000;
}

locals.getDate = function(dateStr){
  console.log(dateStr)
  return new Date(parseInt(dateStr.substr(0, 4)), parseInt(dateStr.substr(5, 2))-1, parseInt(dateStr.substr(8, 2)));
}

module.exports = locals;