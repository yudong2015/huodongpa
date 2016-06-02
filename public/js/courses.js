$(function(){
    // filter
  $(".downmenu").click(function(){
    $('.teacher-select-panel').addClass('hidden');
    var panel = $("."+$(this).data('downmenu'));
    if(panel.hasClass("hidden")){
      panel.removeClass("hidden");
    } else {
      panel.addClass("hidden");
    }
  });

  $(".teacher-select-panel ul").find("li").click(function(){

    var ul_ = $(this).closest('ul');
    ul_.siblings('input').val($(this).data('id'));
    //var id_ = ul_.attr('id');
    //id_ = id_.substr(0,id_.indexOf('-'));
    //$("#filter-"+id_+"").val($(this).text());

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

  // search
  $(".search-box").click(function(){
    var inp = $(this).find("input");
    $(this).find("input").focus();
    $(".header").addClass("is-search").find(".cancel-btn").click(function(){
      inp.val("");
      $(".header").removeClass("is-search")
    });
  });
});