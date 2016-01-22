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

  $(".recommended-user").each(function(){
    var that = $(this);
    $.getJSON("/admin/users/info", {id: that.data("id")}, function(result) {
      if(result.code == 0){
        that.find(".recommended-accout").html("<a href='/admin/users/detail?id='"+ result.data.id+">"+result.data.username+"</a>");
        that.find(".recommended-name").text(result.data.name);
        that.find(".recommended-tuition").text(result.data.total);
        var unrewarded = result.data.total - parseInt(that.find(".recommended-rewarded").text());
        that.find(".recommended-unrewarded").text(unrewarded);
        if(unrewarded == 0){
          that.find(".recommended-action").html("");
        }
      }
    });
  });

  $(".recommended-action").click(function(){
    var that = $(this).closest(".recommended-user");
    var recommendid = $(this).data("id");
    var tuition = parseInt($(this).parent().find(".recommended-tuition").text());

    $("#reward-confirm-dialog").data("target", recommendid).modal('show');

    $("#reward-confirm-submit").unbind('click').click(function(){
      $.post("/admin/users/recommend?id="+recommendid, {rewarded: tuition}, function(result){
        if(result.code == 0) {
          that.find(".recommended-unrewarded").text(0);
          that.find(".recommended-rewarded").text(tuition);
        }
      });
      $("#reward-confirm-dialog").modal('hide');
    });
  });
});