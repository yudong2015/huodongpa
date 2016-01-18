$(function(){
  function getProfit() {
    var year = $(".profit-year").val();
    var quarter = $(".profit-quarter").val();

    $.getJSON("/admin/profit/teacher", {id: $("#teacher-id").text(), year: year, quarter: quarter}, function(result){
      if(result.code == 0){
        $(".profit-sum").text(result.data);
      }
    });
  }

  $(".profit-select").change(function(){
    getProfit();
  });

  getProfit();
});