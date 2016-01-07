$(function(){
  var codeSent = false;

  //form submit 
  $("#login-form-submit").click(function(){
    $("#login-form").submit(); 
  });

  // form validator
  var validator = new FormValidator('login-form', [{
    name: 'username',
    display: '手机号',
    rules: 'required|numeric'
  }, {
    name: 'password',
    display: '密码',
    rules: 'required'
  }], function(errors, event) {
    if (errors.length > 0) {
        $.tips(errors[0].message);
    }
  });
  validator.setMessage('required', '请填写%s');
  validator.setMessage('numeric', '%s格式错误');

});