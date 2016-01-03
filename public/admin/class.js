$(function(){
  $('#class-dates .input-group.date').datepicker({
    format: "yyyymmdd",
    multidate: true,
    startDate: "today",
    clearBtn: true,
    todayHighlight: true,
    todayBtn: true,
    language: "zh-CN"
  });
  $('#register-date .input-group.date').datepicker({
    format: "yyyymmdd",
    autoclose: true,
    startDate: "today",
    clearBtn: true,
    todayHighlight: true,
    todayBtn: true,
    language: "zh-CN"
  });
});