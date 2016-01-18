$(function(){
  var scope = $("#scope").text();

  function getProfit() {
    var year = $(".profit-year").val();
    var quarter = $(".profit-quarter").val();

    $.getJSON("/admin/profit/course", {id: $("#course-id").text(), year: year, quarter: quarter}, function(result){
      if(result.code == 0){
        $(".profit-sum").text(result.data);
      }
    });
  }

  $(".profit-select").change(function(){
    getProfit();
  });

  getProfit();

  function combineClass(src, des) {
    $.post("/admin/classes/combine", {source: src, dest: des}, function(result){
      if(result.code == 0){
        alert("合班操作成功！")
        location.reload();
      } else {
        alert(result.message);
      }
    });
  }

  function cancelClass(src) {
    $.post("/admin/classes/cancel", {id: src}, function(result){
      if(result.code == 0){
        alert("取消班级成功！")
        location.reload();
      } else {
        alert(result.message);
      }
    });
  }

  var src;

  $(".combine-action").click(function() {
    src = $(this).closest("tr").data("id");
    var name = $(this).closest("tr").data("name");

    $("#class-combine-dialog #combine-class-src").val(name);

    $("#class-combine-dialog").modal('show');

    $("#class-combine-dialog #class-combine-submit").unbind("click").click(function(){
      var dest = $("#combine-class-dest").val();
      combineClass(src, dest);

      $("#class-combine-dialog").modal('hide');
    });
  });

  $(".cancel-action").click(function() {
      src = $(this).closest("tr").data("id");
      var name = $(this).closest("tr").data("name");
      if(confirm("确定取消课程" + name + "？")){
        cancelClass(src);
      }
  });

  $(".edit-action").click(function(){
    var url = $(this).attr("href");
    if(scope == "preregister"){
      return true;
    }

    $("#class-confirm-dialog").modal('show');

    $("#class-confirm-dialog #class-confirm-submit").unbind("click").click(function(){
      if($("#class-confirm-edit").val() == "EDIT"){
        $("#class-confirm-dialog").modal('hide');
        location.href = url;
      }
    });
    return false;
  });

});