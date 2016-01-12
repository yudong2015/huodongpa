$(function(){
  $(".show-detail-btn").click(function() {
    var detail = $(this).parent().next();
    if(detail.hasClass("hidden")){
      detail.removeClass("hidden");
    } else {
      detail.addClass("hidden");
    }
  });

  $(".add-btn").click(function(){
    var btn = $(this);
    btn.text("请稍后...");
    $.post("/cart/add", {"id": $(this).data("id")}, function(result) {
      if(result.code == 0){
        btn.text("已加入购物车");
      } else {
        btn.text(result.message);
      }
    });
  });
});