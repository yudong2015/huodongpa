$(function(){
  $(".profit-select").change(function(){
    alert(1);

    var year = $(".profit-year").val();
    var quarter = $(".profit-quarter").val();

    $.getJSON("/admin/profit/course", {id: $("#course-id").text(), year: year, quarter: quarter}, function(result){

    });
  });
});