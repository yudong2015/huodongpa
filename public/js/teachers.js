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

  // search
  $(".search-box").click(function(){
    var inp = $(this).find("input");
    $(this).find("input").focus();
    $(".header").addClass("is-search").find(".cancel-btn").click(function(){
      inp.val("");
      $(".header").removeClass("is-search");
    });
  });
});