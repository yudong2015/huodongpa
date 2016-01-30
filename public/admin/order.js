$(function(){
  $(".order-action").change(function(){
    if($(this).hasClass("order-cancel")){
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
    } else {
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
  });

  var alreadyIn = {};
  $(".class-user-tr").each(function(){
    alreadyIn[$(this).data("id")] = true;
  });

  suggestions = [];
  indexes = {};

  $("#user-typeahead").typeahead({
    highlight: true
  },
  {
    name: 'user-dataset',
    limit: 20,
    source: function(query, syncResults, asyncResults) {
      console.log(query);
      $.getJSON('/admin/users/search', {q: query}, function(result){
        if(result.code == 0 && result.data){
          suggestions = [];
          indexes = {};
          var words = '';
          for(var i=0; i<result.data.length; i++) {
            if(alreadyIn[result.data[i].id]){
              continue;
            }
            words = (result.data[i].name|| '') + '(' + result.data[i].username + ')'; 
            suggestions.push(words);
            indexes[words] = result.data[i];
          }
          console.log(suggestions);
          asyncResults(suggestions);
        }
      });
    }
  });

  $('#user-typeahead').bind('typeahead:select', function(ev, suggestion) {
    console.log('Selection: ' + suggestion);
    $("#user-id").val(indexes[suggestion].id);
  });
});