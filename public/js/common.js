$(function(){
  $.tips = function(text){
    $(".tips-dialog").removeClass("hidden").find("p").text(text);
    setTimeout(function(){
      $(".tips-dialog").addClass("hidden");
    }, 1000);
  }
});