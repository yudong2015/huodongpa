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

module.exports = locals;