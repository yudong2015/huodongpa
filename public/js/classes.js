$(function(){
  $(".show-detail-btn").click(function() {
    var detail = $(this).parent().next();
    if(detail.hasClass("hidden")){
      detail.removeClass("hidden");
    } else {
      detail.addClass("hidden");
    }
  });
});