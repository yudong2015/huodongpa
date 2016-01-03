$(function(){
  $("#add-category").click(function(){
    name = $("#new-category-name").val();
    if (!name){
      alert("请输入分类名称！");
      return
    }
    var category = {
      name: name
    }
    $.post("/admin/courses/category",
      category,
      function(data, status, xhr){
        if(data.code == 0) {
          alert("添加分类成功");
          $("#course-categories").data("id", data.data);
          updateCategories();
        } else {
          console.log(data.message);
          alert("添加分类失败，请重试");
        }
      }
    );
  });

  function updateCategories(){
    $.getJSON('/admin/courses/categories', {}, function(result){
      sel = $("#course-categories").html("");
      if(result.code == 0 && result.data){
        var opts = result.data;
        for( var i=0; i<opts.length; i++){
          sel.append("<option value="+opts[i].id+">"+opts[i].name+"</option>");
        }
        if(sel.data("id")){
          sel.val(sel.data("id"));
        }
      }
    });
  }


  
  updateCategories();

});