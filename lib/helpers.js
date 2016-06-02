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
};
locals.findMinAndMax = function(arg){
  arg = arg.split(',').sort();
  return [arg[0],arg[arg.length-1]];
};

locals.findCoursesOfTeacher = function(teacher){
  var courses = {};
  for(var i=0; i<teacher.Classes.length; i++) {
    if(courses[teacher.Classes[i].course.id]){
      //lowprice
      teacher.Classes[i].course.lowprice = Math.min(courses[teacher.Classes[i].course.id].lowprice,teacher.Classes[i].tuition);
      var dates = locals.findMinAndMax(teacher.Classes[i].classDates);
      console.log(courses[teacher.Classes[i].course.id].begindate);
      teacher.Classes[i].course.begindate = Math.min(courses[teacher.Classes[i].course.id].begindate,dates[0]);
      teacher.Classes[i].course.enddate = Math.max(courses[teacher.Classes[i].course.id].enddate,dates[1]);

    }else{
      //lowprice
      teacher.Classes[i].course.lowprice = teacher.Classes[i].tuition;
      var dates = locals.findMinAndMax(teacher.Classes[i].classDates);
      teacher.Classes[i].course.begindate = dates[0];
      teacher.Classes[i].course.enddate = dates[1];
    }
   // if(courses.Classes[i])
    var _begin = teacher.Classes[i].course.begindate+'';
    var _end = teacher.Classes[i].course.enddate+'';
    var md = _end.substr(4,2)+'.'+_end.substr(6,2);
    teacher.Classes[i].course.datedesc  = _begin.substr(0,4)+'.'+_begin.substr(4,2)+'.'+_begin.substr(6,2)+'-'+(_end.substr(0,4)==_begin.substr(0,4)?(''):(_end.substr(0,4)+'.'))+md;
    courses[teacher.Classes[i].course.id] = teacher.Classes[i].course;


  }
  console.log(JSON.stringify(courses));
  return courses;
};

locals.checkClassConflict =function(){}

locals.compareDateWithToday = function(date) {
  return (date.getTime() - (new Date().getTime()))/86400000;
}

locals.getDate = function(dateStr){
  console.log(dateStr)
  return new Date(parseInt(dateStr.substr(0, 4)), parseInt(dateStr.substr(5, 2))-1, parseInt(dateStr.substr(8, 2)));
}

//计算该年该月的天数  
function getDayCountByYearAndMonth(year,month) {  
    month++;  
    if(month==4 || month==6 ||  month==9 || month==11)  
        return 30;  
    if(month==2)  
    {  
        if(((year%4==0)&&(year%100!=0)) || (year%400 == 0))  
            return 29;  
        return 28;  
    }  
    return 31;  
} 

locals.getMonthInfo = function(year, month) {
  var info = {};
  info.year = year;
  info.month = month;
  info.firstDay = new Date(year,month,1);
  info.daysCount = getDayCountByYearAndMonth(year, month);
  return info;
}

locals.getPrevMonthInfo = function(year, month) {
  month--;
  if(month < 0){
    month = 11;
    year--;
  }
  return locals.getMonthInfo(year, month);
}

locals.getNextMonthInfo = function(year, month) {
  month++;
  if(month > 11){
    month = 0;
    year++;
  }
  return locals.getMonthInfo(year, month);
}

locals.isObjectEmpty = function(obj) {
  for(var i in obj){
    if(obj.hasOwnProperty(i)){
      return false;
    }
  }
  return true;
}

module.exports = locals;