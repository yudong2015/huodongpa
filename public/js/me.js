$(function(){
  $("#user-profile-form").find(".btn-box").click(function() {
    $("#user-profile-form").submit();
  });

  // form validator
  var validator = new FormValidator('user-profile-form', [{
    name: 'name',
    display: '真实姓名',
    rules: 'required'
  }, {
    name: 'emergencyPhone',
    display: '紧急联系电话',
    rules: 'required|numeric'
  }, {
    name: 'address',
    display: '住址',
    rules: 'required'
  }], function(errors, event) {
    if (errors.length > 0) {
        $.tips(errors[0].message);
    }
  });
  validator.setMessage('required', '红星那么显眼你为什么不填> <');
  validator.setMessage('numeric', '%s格式错误');

  if(window.Qiniu){
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
  }
});