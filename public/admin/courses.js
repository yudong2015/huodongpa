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
        alert("添加分类成功");
        updateCategories();
      }
    );
  });

  function updateCategories(){
    $.getJSON('/admin/courses/categories', {}, function(result){
      sel = $("#course-categories").html("");
      if(result.code == 0 && result.data){
        var opts = result.data;
        for( var i=0; i<opts.length; i++){
          sel.append("<option value="+opts[i].id+">"+opts[i].name+"</option>")
        }
      }
    });
  }


  
  updateCategories();

});