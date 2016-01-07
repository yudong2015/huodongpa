$(function(){
  var codeSent = false;

  //form submit 
  $("#register-form-submit").click(function(){
    $("#register-form").submit(); 
  });

  // send verify code 
  $("#send-code").click(function(){
    if(codeSent) {
      return
    }
    codeSent = true;
    var phone = $("#user-phone").val();
    if(phone == "") {
      $.tips("请填写电话号码");
      return;
    }
    $.post("/register/code", { phone: phone }, function(){
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
    })
  });

  // form validator
  var validator = new FormValidator('register-form', [{
    name: 'username',
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

  // avatar upload
  var uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4',    //上传模式,依次退化
    browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
    uptoken_url: '/qiniu/uptoken',
    unique_names: true,
    domain: $("#qiniu-domain").val(),
    max_file_size: '10mb',           //最大文件体积限制
    flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
    max_retries: 3,                   //上传失败最大重试次数
    dragdrop: true,                   //开启可拖曳上传
    chunk_size: '4mb',                //分块上传时，每片的体积
    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
    init: {
        'FilesAdded': function(up, files) {
            plupload.each(files, function(file) {
                // 文件添加进队列后,处理相关的事情
            });
        },
        'BeforeUpload': function(up, file) {
               // 每个文件上传前,处理相关的事情
               $.tips("正在上传...");
        },
        'UploadProgress': function(up, file) {
               // 每个文件上传时,处理相关的事情
        },
        'FileUploaded': function(up, file, info) {
               // 每个文件上传成功后,处理相关的事情
               // 其中 info 是文件上传成功后，服务端返回的json，形式如
               // {
               //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
               //    "key": "gogopher.jpg"
               //  }
               // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
               $.tips("头像上传成功");
               var domain = up.getOption('domain');
               var res = JSON.parse(info);
               var sourceLink = domain + res.key; //获取上传成功后的文件的Url
               $("#avatar-url").val(sourceLink);
               $(".photo-btn").html($("img").attr("src", sourceLink));

        },
        'Error': function(up, err, errTip) {
               //上传出错时,处理相关的事情
               $.tips("头像上传失败");
        },
        'UploadComplete': function() {
               //队列文件处理完毕后,处理相关的事情
        },
        'Key': function(up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在 unique_names: false , save_key: false 时才生效
            var key = "";
            // do something with key here
            return key
        }
    }
  });
});