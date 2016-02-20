$(function() {

  var allClasses = [];

  $.getJSON("/cart/classes/paid", function(result){
    if(result.code == 0) {
      allClasses = result.data;
      findConfictClasses();
    }
  });


  $(".check-panel").click(function(){
    if($(this).hasClass('disabled')) {
      return false;
    }

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

  $(".clear-btn").unbind("click").click(function() {
    var classes = "";
    $(".overdue-panel").each(function(){
      classes += $(this).closest(".car-panel").data("id") + ",";
    });
    if(classes){
      classes = classes.substr(0, classes.length-1);
      deleteClass(classes);
    }
  });

  $(".contact-btn").unbind("click").click(function() {
    $.dialog($("#pay-help").html());
  });

  $(".pay-btn").unbind("click").click(function(){
    $.dialog("确认购买所选课程？", function(){
      var classes = "";
      $(".check-panel i.is-checked").each(function(){
        classes += $(this).closest(".car-panel").data("id") + ",";
      });
      if(classes){
        classes = classes.substr(0, classes.length-1);
        buyClass(classes);
      }
      $(".dialog .cancel-btn").remove();
      $(".dialog .btn").css("width", "100%");
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

  function check2ClassConflict(class1, class2){
    var dates1 = class1.classDates.split(',');
    var dates2 = class2.classDates.split(',');
    if(_.intersection(dates1, dates2).length > 0){
      if((class1.endTime < class2.beginTime) || (class2.endTime < class1.beginTime)) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  function findConfictClasses() {
    $(".car-panel").each(function(){
      var panel = $(this);
      var clas = {
        classDates : panel.data("dates"),
        beginTime: panel.data("btime"),
        endTime: panel.data("etime")
      }
      for(var i=0; i<allClasses.length; i++) {
        if(check2ClassConflict(clas, allClasses[i]["class"])){
          panel.find(".notice-box").show();
          break;
        }
      }
      allClasses.push({"class": clas});
    });
  }

});