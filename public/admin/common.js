$(function(){
  // image preview
  $(".image-popover").hover(function(){
    $("body").popover({
      content: function(){
        return $(this).data("href")?("<img width=200 src='"+$(this).data("href")+"'>"):"暂无";
      },
      html: true,
      placement: "bottom",
      trigger: "hover",
      selector: ".image-popover"
    });
  });
  
  // delete item
  $(".delete-action").click(function(){
    if(confirm("确定删除？")){
      $.post($(this).data("url"), {id: $(this).data("id")}, function(data, status, xhr){
        if(data.code == 0) {   
          alert("删除成功");
          window.location.href=window.location.href;
        } else {
          console.log(data.message);
          alert("删除失败：" + data.message);
        }
      });
    }
  });
  
});