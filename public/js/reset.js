$(function(){
  var codeSent = false;

  //form submit 
  $("#reset-form-submit").click(function(){
    $("#reset-form").submit(); 
  });

  // send verify code 
  $("#send-code").click(function(){
    if(codeSent) {
      return
    }
    var phone = $("#user-phone").val();
    if(phone == "") {
      $.tips("请填写电话号码");
      return;
    }
    $.post("/reset/code", { phone: phone }, function(ret){
      if ( ret.code == 0 ) {
        codeSent = true;
        $.tips("发送成功");
        var count = 60;
        var timer = setInterval(function(){
          $("#send-code").text(count + 's');
          count--;
          if (count == 0){
            clearInterval(timer);
            $("#send-code").text("发送");
            codeSent = false;
          }
        }, 1000);
      } else {
        $.tips(ret.message);
      }
    })
  });

  // form validator
  var validator = new FormValidator('reset-form', [{
    name: 'phone',
    display: '手机号',
    rules: 'required|numeric'
  }, {
    name: 'password',
    display: '密码',
    rules: 'required'
  }, {
    name: 'code',
    display: '验证码',
    rules: 'required|numeric'
  }], function(errors, event) {
    if (errors.length > 0) {
        $.tips(errors[0].message);
    }
  });
  validator.setMessage('required', '请填写%s');
  validator.setMessage('numeric', '%s格式错误');

});