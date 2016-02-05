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

  function deleteClass(id) {
    $.post("/cart/delete", {"id": id}, function(result) {
      if(result.code == 0){
        location.href = location.href;
      } else {
        $.tips('删除失败，请重试');
      }
    });
  }

  function buyClass(id) {
    $.post("/cart/buy", {"id": id}, function(result) {
      if(result.code == 0){
      } else {
        $.tips('购买失败，请重试');
      }
    });
  }

  $(".del-btn").unbind("click").click(function(){
    var classPanel = $(this).closest(".car-panel");
    if(classPanel.find("overdue-panel").size()){
      deleteClass(classPanel.data("id"));
    } else {
      $.dialog("确认删除？", function(){
        deleteClass(classPanel.data("id"));
      });
    }
  });

  $(".clear-btn").unbind("click").click(function(){
    var classes = "";
    $(".overdue-panel").each(function(){
      classes = $(this).closest(".car-panel").data("id") + ",";
    });
    if(classes){
      classes = classes.substr(0, classes.length-1);
      deleteClass(classes);
    }
  });

  $(".pay-btn").unbind("click").click(function(){
    $.dialog("确认购买所选课程？", function(){
      var classes = "";
      $(".check-panel i.is-checked").each(function(){
        classes = $(this).closest(".car-panel").data("id") + ",";
      });
      if(classes){
        classes = classes.substr(0, classes.length-1);
        buyClass(classes);
      }
      $.dialog($("#pay-help").html(), function(){
        location.href = location.href;
      });
    });
    
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