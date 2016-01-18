$(function(){
  function getProfit() {
    var year = $(".profit-year").val();
    var quarter = $(".profit-quarter").val();

    $.getJSON("/admin/profit/user", {id: $("#user-id").text(), year: year, quarter: quarter}, function(result){
      if(result.code == 0){
        $(".profit-sum").text(result.data);
      }
    });
  }

  $(".profit-select").change(function() {
    getProfit();
  });

  getProfit();
});