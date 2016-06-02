$(function(){
  $.getJSON('http://slide.cm/wechat/config', {
      url: location.href.split('#')[0]
  }, function(data) {
      wx.config({
          debug: false,
          appId: "wx82a5d90838b461ba",
          timestamp: data.config.timestamp,
          nonceStr: data.config.nonceStr,
          signature: data.config.signature,
          jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
          ]
      });

      var config = {
        title: '快到活动葩碗里来',
        link: window.location.href,
        imgUrl: 'http://' + window.location.hostname + ':' + window.location.port + '/img/icon.jpg',
        desc: '这里是京城最靠谱的出国课程集中营~ 加入我们，了解相关课程和教师信息，或许有你想报的课哟~'
      };
      wx.ready(function() {
          wx.onMenuShareTimeline(config);
  
          wx.onMenuShareAppMessage(config);
      });
  
      wx.error(function(res) {
          console.log(JSON.stringify(res));
      });
  });
});