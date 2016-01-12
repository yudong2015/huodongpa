var locals = {};

var hanzDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

locals.splitClassDates = function(dates) {
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

var colors = ['red', 'purple', 'blue', 'green', 'orange'];

locals.pickLabelColor = function(id) {
  return colors[id%5];
}

module.exports = locals;