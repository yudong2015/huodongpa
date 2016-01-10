$(function(){
    // filter
  $(".filter-box").click(function(){
    var panel = $(".teacher-select-panel");
    if(panel.hasClass("hidden")){
      panel.removeClass("hidden");
    } else {
      panel.addClass("hidden");
    }
  });

  $("#category-filter").find("li").click(function(){
    $("#category-id").val($(this).data("id"));
    $("#category-name").val($(this).text());
    $("#category-form").submit();
  });

  // first time view turiol
  if(!cookie.get("hasviewed")){
    cookie.set("hasviewed", "true", {
      expires: 60
    });
    $(".course-ex-panel").removeClass("hidden").find(".close-btn").click(function(){
      $(".course-ex-panel").addClass("hidden");
    });
  };


  // jump
  $(".course-panel").click(function(){
    window.location.href = $(this).data("href");
  });
});