$(function(){
  $(".order-action").change(function(){
    if($(this).hasClass("order-cancel")){
      if (confirm("确定退课？")) {
        $.post("/admin/orders/cancel",
          {id: $(this).data("id")},
          function(data, status, xhr){
            if(data.code == 0) {
              alert("退课成功");
              window.location.href = window.location.href;
            } else {
              console.log(data.message);
              alert("退课失败，请重试");
            }
          });
      }
    } else {
      if (confirm("确定恢复？")) {
        $.post("/admin/orders/recover",
          {id: $(this).data("id")},
          function(data, status, xhr){
            if(data.code == 0) {
              alert("恢复成功");
              window.location.href = window.location.href;
            } else {
              console.log(data.message);
              alert("恢复失败，请重试");
            }
          });
      }
    }
  });
});