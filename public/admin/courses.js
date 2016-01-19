$(function(){
  function getProfits() {
    $("tr.course-row").each(function() {
      var that = $(this);
      var id = that.data("id");
      $.getJSON("/admin/profit/course", {id: id, year: 65535, quarter: 65535}, function(result){
        if(result.code == 0) {
          that.find(".profit-sum").text(result.data);
        }
      });
    });
  }

  getProfits();
});