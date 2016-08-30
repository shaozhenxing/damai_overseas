$(document).ready(function (e) {
  var uri = window.location.href.replace(/\/[^\/]*$/, '/');
  var titlex = '缤纷双麦 为爱麦跑';
  var descx = '500个大麦专属名额开抢！更多壕气礼包免费送！';
  var img_urlx = uri + 'images/share.jpg';
  var linkx = uri;
  var json = {};

  //点击遮罩层和提示隐藏弹层
  /*touch.on('.m-mask', 'tap', function () {
    common.modal.hideModal('.m-modal-wechat');
  });*/

  if (common.isWechat()) $('.u-btn-share').hide();

  $('.m-modal-wechat').on('click', function () {
    common.modal.hideModal('.m-modal');
  });

  // 分享给好友
  $(document).on('click', '.u-btn-share', function () {

    //$(this).addClass('z-act');
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      common.modal.showModal('.m-modal-wechat');
    } else {
      common.modal.showModal('.m-modal-share');
    }
  });

  $('.u-btn-share-main').on('click', function () {
    setClientShare({
      title: titlex,
      desc: descx,
      img: img_urlx,
      url: linkx
    });
  });
  
  commonshare();

  setClientShare({
    title: titlex,
    desc: descx,
    img: img_urlx,
    url: linkx
  });

  function setClientShare( options ) {
    // 设置微信朋友圈 url
    $('.m-modal-share .u-btn-timeline').attr('href', 'http://m.damai.cn/weixinfshare.aspx?title=' + options.title + '&content=' + options.desc + '&pics=' + options.img + '&rurl=' + options.url);

    // 设置微信 url
    $('.m-modal-share .u-btn-wechat').attr('href', 'http://m.damai.cn/weixinshare.aspx?title=' + options.title + '&content=' + options.desc + '&pics=' + options.img + '&rurl=' + options.url);
  }

  function commonshare() {
    // 渲染
    if (navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1) {
      //获取url
      var url = location.href.split('#')[0];

      //发送请求调用方法
      $.ajax({
        cache: false,
        type: 'GET',
        url: 'http://www.veli.com.cn/api/weixin/share',
        data: {
          url: encodeURIComponent(url)
        },
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'success_jsonp',
        timeout: 10000,
        success: function (json) {
          //alert(JSON.stringify(json));
          
          if (json.success) {
            var data = json.data;
          
            share(data.appId, data.timestamp, data.nonceStr, data.signature);

            //alert(JSON.stringify(data));
            return;
          } else {
            return;
          }
        },
        error: function () {
          return;
        }
      });
    } else {
        
    }
  }

  function share(appId, timestamp, nonceStr, signature) {
    wx.config({
      debug: false,
      appId: appId,
      timestamp: timestamp,
      nonceStr: nonceStr,
      signature: signature,
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
    });

    wx.ready(function() {
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      shareTimeline();

      shareAppMessage();
    });
  }

  function shareAppMessage(options) {
    options = options || {};

    wx.onMenuShareAppMessage({
      title: options.title || titlex,
      // 分享标题
      desc: options.desc || descx,
      // 分享描述
      link:  options.url || linkx,
      // 分享链接
      imgUrl: options.img || img_urlx,
      // 分享图标
      success: function() {
        // 用户确认分享后执行的回调函数
        //window.location.href = 'http://mp.weixin.qq.com/s?__biz=MzAwNDI4MTU1Mg==&mid=400117654&idx=1&sn=0fb43937868895df2bb51232a2dfba36#rd';
      },
      cancel: function() {
        // 用户取消分享后执行的回调函数
      }
    });
  }

  function shareTimeline(options) {
    options = options || {};

    wx.onMenuShareTimeline({
      //title: options.title || titlex,
      title: options.desc || descx,
      // 分享标题
      link: options.url || linkx,
      // 分享链接
      imgUrl: options.img || img_urlx,
      // 分享图标
      success: function() {
        // 用户确认分享后执行的回调函数
        //window.location.href = 'http://mp.weixin.qq.com/s?__biz=MzAwNDI4MTU1Mg==&mid=400117654&idx=1&sn=0fb43937868895df2bb51232a2dfba36#rd';
      },
      cancel: function() {
        // 用户取消分享后执行的回调函数
      }
    });
  }

  function set(val) {
    json = val;

    shareTimeline({
      url: val.url,
      img: val.img,
      desc: val.desc,
      title: val.title
    });

    shareAppMessage({
      url: val.url,
      img: val.img,
      desc: val.desc,
      title: val.title
    });
    
    //alert(JSON.stringify(val));
    
    setClientShare({
      url: val.url,
      img: val.img,
      desc: val.desc,
      title: val.title
    });
  }

  return {
    set: set
  };
});