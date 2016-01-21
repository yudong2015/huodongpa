$(function(){
  // tips
  $.tips = function(text) {
    $(".tips-dialog").removeClass("hidden").find("p").text(text);
    setTimeout(function(){
      $(".tips-dialog").addClass("hidden");
    }, 1000);
  }

  if( $(".tips-dialog").find("p").text() != "" ) {
    $.tips($(".tips-dialog").find("p").text());
  }

  $.dialog = function(text, confirm, cancel) {
    $(".dialog").removeClass("hidden").find(".tips-content").text(text);
    $(".dialog").find(".btn").click(function(){
      $(".dialog").addClass("hidden");
      if($(this).hasClass("ok-btn")){
        if (confirm)  confirm();
      } else {
        if (cancel)  cancel();
      }
    });
  }

  $(".left-nav-ct .close-btn").click(function(){
    $(".left-nav-ct").addClass("hidden");
  });

  $(".header-panel .de-avatar, .share-title .avatar-box").click(function(){
    $(".left-nav-ct").removeClass("hidden");
  });

  $(".anchor").click(function(){
    window.location.href = $(this).data("href");
  });

  $(".show-detail-btn").click(function() {
    var detail = $(this).parent().next();
    if(detail.hasClass("hidden")){
      detail.removeClass("hidden");
    } else {
      detail.addClass("hidden");
    }
  });
  
});