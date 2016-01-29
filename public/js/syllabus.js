$(function(){
  var rows = $('.day-list').size();
  if (rows == 4)
    $(".date-panel-space").addClass('is-four');
  if (rows == 6)
    $(".date-panel-space").addClass('is-six');

  var classes = {};

  $.getJSON('/syllabus/classes', {year: $('#year').text(), month:$('#month').text()}, function(result){
    if(result.code == 0) {
      classes = result.data;
      for(var date in classes) {
        $("#date-" + date).addClass("has");
      }
      var today = new Date();
      $("#date-" + today.getDate()).click();
    }
  });

  function showClass(date) {
    $(".syll-list").empty();

    var classesOfDate = classes[date];
    if(!classesOfDate){
      return;
    }

    var classesOfDateArr = [];
    for(var id in classesOfDate){
      classesOfDateArr.push(classesOfDate[id]);
    }
    classesOfDateArr.sort(function(a, b){
      return a.beginTime - b.beginTime;
    });

    for(var i=0; i<classesOfDateArr.length; i++){
      var tpl = $("#class-tpl").clone().removeClass("hidden");
      tpl.find(".begin-time").text(classesOfDateArr[i].beginTime);
      tpl.find(".end-time").text(classesOfDateArr[i].endTime);
      tpl.find(".class-tpl-name").text(classesOfDateArr[i].course.name + '＊' + classesOfDateArr[i].name);
      tpl.find(".class-tpl-address").text(classesOfDateArr[i].address);
      $(".syll-list").append(tpl);
    }

  }

  var datesBtn = $(".syll-date");
  datesBtn.click(function(){
    datesBtn.removeClass('active');
    $(this).addClass('active');
    var date = $(this).find('div').text();
    showClass(date);
  });

});