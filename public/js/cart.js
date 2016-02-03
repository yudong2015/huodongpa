$(function() {

  $(".check-panel").click(function(){
    if($(this).closest(".car-panel").find("overdue-panel").size()){
      return false;
    }

    var checkbox = $(this).find("i");
    if (checkbox.hasClass("is-checked")) {
      checkbox.removeClass("is-checked");
    } else {
      checkbox.addClass("is-checked");
    }
    calcTotalTuition();
  });

  $(".check-box").click(function(){

    if ($(this).hasClass("is-checked")){
      $(this).removeClass("is-checked");
      $(".check-panel i").removeClass("is-checked");
    } else {
      $(this).addClass("is-checked");
      $(".check-panel i").addClass("is-checked");
    }
    $(".overdue i").removeClass("is-checked");
    calcTotalTuition();
  });

  function calcTotalTuition(){
    var total = 0;
    $(".car-top-info").each(function(){
      if($(this).find(".check-panel i").hasClass("is-checked")){

        $(this).find(".price-box .price").each(function(){
          total += $(this).data("tuition");
        });
      }
    });
    $(".total-price .price").text(total);
  }
});