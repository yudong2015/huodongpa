$(function(){
  $(".image-popover").hover(function(){
    $("body").popover({
      content: function(){
        return $(this).data("href")?("<img width=200 height=200 src='"+$(this).data("href")+"'>"):"暂无";
      },
      html: true,
      placement: "bottom",
      trigger: "hover",
      selector: ".image-popover"
    });
  });
  
});