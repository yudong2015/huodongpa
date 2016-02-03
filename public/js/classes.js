$(function(){

  $(".add-btn").click(function(){
    var btn = $(this);
    if (btn.hasClass("in-cart") || btn.hasClass("is-paid")){
      return false;
    }
    btn.text("请稍后...");
    $.post("/cart/add", {"id": $(this).data("id")}, function(result) {
      if(result.code == 0){
        btn.text("已加入购物车");
      } else {
        btn.text(result.message);
      }
    });
    // $.dialog("程序员哥哥正在努力开通线上支付功能，请前往上课地点面对面缴费，或者联络教员（微信号：chenyuankaiabc）");
  });
});