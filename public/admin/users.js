$(function(){
  function getProfits() {
    $(".user-id").each(function() {
      var that = $(this);
      var id = that.data("id");
      $.getJSON("/admin/profit/user", {id: id, year: 65535, quarter: 65535}, function(result){
        if(result.code == 0) {
          that.closest("tr").find(".profit-sum").text(result.data);
        }
      });
    });
  }

  getProfits();
});