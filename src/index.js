  var ua = navigator.userAgent;
  var devicePixelRatio = window.devicePixelRatio ? window.devicePixelRatio >= 2 ? 2:window.devicePixelRatio: 1;

  var isIpad = ua.match(/(iPad)/);

  var isRetinaDevice = devicePixelRatio >= 2;

  //pad默认展示高清屏幕，继承自手淘的策略
  if (isIpad) {
      isRetinaDevice = true;
  }
  //域名收敛地址
  var DEFAULT_HOSTNAME = '\/\/img.alicdn.com';

  //cdn后缀正则
  var REG_IMG_EXT =  /_(?:(sum|m|b|\d+x\d+)(xz|xc)?)?(c[xy]\d+i\d+)?(co0)?([qQ]\d+)?(g)?(s\d+)?\.jpg(_.webp)?$/;  //解析图片后缀信息的正则

  //cdn图片特殊处理的后缀将不做处理，
  var REG_NO_EXT = /_(?:(sum|m|b|\d+x\d+))?((xz|xc)|g|co0|(c[xy]\d+i\d+))([qQ]\d{2})?(s\d+)?\.jpg/;

  //图片格式化
  var REG_FORMAT = /_\.(webp)/;

  var REG_TPS = /(alicdn|taobaocdn|wimg\.taobao)\.(com|net)/;  //判断图片网址是否tps的正则

  var REG_NO_TPS = /(\.gif|\.svg)/;  //


  //四种图片类型:方图，定宽，定高，裁剪
  var IMG_TYPE_SQUARE = 'square';
  var IMG_TYPE_WF = 'widthFixed';
  var IMG_TYPE_HF = 'heightFixed';
  var IMG_TYPE_XZ = 'xz';
  //cdn尺寸对象
  var CDN = {};
  //正方形尺寸列表
  //将尺寸以每组尺寸高宽最小为纬度从大到小排序。
  var sizeList = [ [ 16 ],
  [ 20 ],
  [ 24 ],
  [ 30 ],
  [ 32 ],
  [ 36 ],
  [ 40 ],
  [ 190, 43 ],
  [ 90, 45 ],
  [ 48 ],
  [ 100, 50 ],
  [ 50 ],
  [ 96, 54 ],
  [ 90, 60 ],
  [ 60 ],
  [ 80, 60 ],
  [ 120, 60 ],
  [ 60, 90 ],
  [ 64 ],
  [ 81, 65 ],
  [ 70 ],
  [ 140, 70 ],
  [ 70, 1000 ],
  [ 72 ],
  [ 121, 75 ],
  [ 75, 100 ],
  [ 75 ],
  [ 80 ],
  [ 160, 80 ],
  [ 80, 1000 ],
  [ 230, 87 ],
  [ 88 ],
  [ 110, 90 ],
  [ 90 ],
  [ 160, 90 ],
  [ 180, 90 ],
  [ 120, 90 ],
  [ 90, 135 ],
  [ 100, 150 ],
  [ 100 ],
  [ 100, 1000 ],
  [ 140, 100 ],
  [ 200, 100 ],
  [ 115, 100 ],
  [ 264, 100 ],
  [ 110, 10000 ],
  [ 110 ],
  [ 170, 120 ],
  [ 120, 160 ],
  [ 120 ],
  [ 125 ],
  [ 128 ],
  [ 130 ],
  [ 140 ],
  [ 210, 140 ],
  [ 142 ],
  [ 145 ],
  [ 150 ],
  [ 150, 200 ],
  [ 150, 10000 ],
  [ 400, 152 ],
  [ 160 ],
  [ 160, 240 ],
  [ 160, 180 ],
  [ 165, 5000 ],
  [ 170 ],
  [ 170, 10000 ],
  [ 10000, 170 ],
  [ 485, 175 ],
  [ 180 ],
  [ 180, 230 ],
  [ 270, 180 ],
  [ 190 ],
  [ 196 ],
  [ 200 ],
  [ 210 ],
  [ 210, 1000 ],
  [ 220, 10000 ],
  [ 220 ],
  [ 220, 330 ],
  [ 10000, 220 ],
  [ 220, 5000 ],
  [ 250, 225 ],
  [ 230 ],
  [ 234 ],
  [ 240, 5000 ],
  [ 240, 10000 ],
  [ 240 ],
  [ 250 ],
  [ 270 ],
  [ 270, 450 ],
  [ 420, 280 ],
  [ 280, 410 ],
  [ 284 ],
  [ 288, 480 ],
  [ 290 ],
  [ 290, 10000 ],
  [ 292 ],
  [ 294, 430 ],
  [ 300, 1000 ],
  [ 300 ],
  [ 310 ],
  [ 320, 5000 ],
  [ 320, 480 ],
  [ 320 ],
  [ 490, 330 ],
  [ 336 ],
  [ 10000, 340 ],
  [ 350 ],
  [ 350, 1000 ],
  [ 360 ],
  [ 560, 370 ],
  [ 400 ],
  [ 790, 420 ],
  [ 480, 420 ],
  [ 430 ],
  [ 440 ],
  [ 660, 440 ],
  [ 450, 10000 ],
  [ 500, 450 ],
  [ 450, 600 ],
  [ 450, 5000 ],
  [ 460 ],
  [ 468 ],
  [ 640, 480 ],
  [ 480 ],
  [ 490 ],
  [ 500, 1000 ],
  [ 10000, 500 ],
  [ 540 ],
  [ 560, 840 ],
  [ 560 ],
  [ 570 ],
  [ 570, 10000 ],
  [ 580 ],
  [ 580, 10000 ],
  [ 600 ],
  [ 620, 10000 ],
  [ 640 ],
  [ 670 ],
  [ 720 ],
  [ 728 ],
  [ 760 ],
  [ 790, 10000 ],
  [ 960 ],
  [ 970 ],
  [ 1080, 1800 ],
  [ 1152, 1920 ],
  [ 1200 ],
  [ 2200 ] ];

  //域名收敛列表
  CDN.domainCList =/\/\/\S+\.alicdn\.com/;
  //添加cdn后缀需要过滤的域名列表,被过滤的域名将不做任何处理
  CDN.filterDomains = [];

  /*function sequence (list){
    var len = list.length;
    var i=0;

    while(i  < len){
    var j = (i++) + 1;
          while( (j++) < len - 1){
              var temp;
              var listA = list[i];
              var listB = list[j];
              var a = Math.min(listA[0],(listA[1] || Infinity));
              var b = Math.min(listB[0],(listB[1] || Infinity));

              if(a > b){
                  temp = list[i];
                  list[i] = list[j];
                  list[j] = temp;
              }
          }
      }
      return list;
  }
  */


  /*判断网络环境
  * 只定义4G,wifi为强网环境,充分利用缓存的图片
  * 默认为强网环境，未来的趋势是强网环境。
  * 切换环境的时候缓存图片是否可用
  **/
  var isStrongNetWork = false;

  function detectNetWork(callback) {
      var isAliApp = window.Ali||false;

    if (isAliApp&&Ali.network) {
        Ali.network.getType(function (info) {
          if(info && (info.type==("wifi"||"4G"))) {
              isStrongNetWork = true;
          }
          callback&callback();
        });
    }else{
          callback&callback();
    }
  }



  var isWebp = false;
  //webp格式探测
  function detectWebp(callback) {
      //只探测一次
      if(isWebp){
        return;
      };

      try{
        isWebp =  window.localStorage && window.localStorage.getItem('isWebpSupport');
      }catch(e){

      }

      if(!isWebp){

          var webP = new Image();
          webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

          webP.onload = function () {

            if (webP.height === 2) {
              isWebp = true;

              //TODO localStorage
              try{
                window.localStorage && window.localStorage.setItem("isWebpSupport",true);
              }catch(e){

              }
            }
          }
      }
  }



  function extend(target, obj) {


    for (var k in obj) {

      if (obj.hasOwnProperty(k)&& typeof k!="undefined") {
        target[k] = obj[k];
      }
    }
    return target;

  }

  function assign(target, obj) {

    var temp = {};

    for (var k in target) {

      if (target.hasOwnProperty(k)&& typeof k!="undefined") {
              temp[k] = target[k]
      }
    }

    for (var k in obj) {
      if (obj.hasOwnProperty(k)&& typeof k!="undefined") {
              temp[k] = obj[k]
      }
    }

    return temp;
  }


/**
   * 根据图片url，删除后缀，获取源图URL
   */
  function getSourceUrl(url) {
    if (!REG_TPS.test(url) || REG_NO_TPS.test(url)) {
      return url;
    }
    return url.replace(REG_IMG_EXT, "").replace(REG_FORMAT, "")
  }


  /**
   * 根据图片url,获取源图大小信息
   */
  function getSize(url) {
    var result = /-(\d+)-(\d+)\./.exec(getSourceUrl(url));
    return result ? [parseInt(result[1], 10), parseInt(result[2], 10)] : null;
  }
/**
   * 根据图片url,获取参数信息
   */
  function getParams(url,noCheck) {
    if (!noCheck && (!REG_TPS.test(url) || REG_NO_TPS.test(url))) {
      return;
    }
    var params, result = REG_IMG_EXT.exec(url);
    params = result ? {
      size: result[1],
      crop: result[2],
      cut: result[3],
      circle: result[4],
      quality: result[5],
      rotate: result[6],
      sharpen: result[7]
    } : {};
    result = REG_FORMAT.exec(url);
    if (result) {
      params.format = result[1];
    }
    return params;
  }

  /*
   * 获取cdn最佳图片尺寸
   * @param {number} width :期望图片的宽度,
   * @param  {number} height: 期望图片的高度
   * */
  function getBestCdnSize(width,height) {

    //对于坑位大小位置的情况取原图大小
    var minWidth = Number.MAX_VALUE;
    var displayWidth = width ||screen.width||0;
    var displayHeight = height||0;

    if(!displayWidth&&!displayHeight){
      return '';
    }

    //坑位宽度*物理像素
    minWidth = Math.max(displayWidth, displayHeight);

    minWidth=minWidth*devicePixelRatio;

    var i = 0,w=0,bestSize='',len=sizeList.length;

    while(minWidth>w&&i<len){
        var width = sizeList[i][0];
        var height = sizeList[i][1] || width;
        i++;
        w = Math.min(width, height);
        bestSize = width + "x" + height
    }

    return bestSize;

  }

  //兼容IE6，7，8
  function hasAttribute(el,name){
      if(el.hasAttribute){
          return el.hasAttribute(name);
      }else{
          return (typeof el.getAttribute(name) == "string");
      }
  }



  //配置参数
  var opts = {
    sharpen: 's50',//锐化参数
    enableAutoFormat:true,
    enableAutoQuality:true,
    enableAutoSize:true,
    clean:true,
    q: ['50', '30']//默认取第一个
  };
  /**
   * 根据图片url获取代表指定tps参数的url
   */
  function getUrl(src, params) {

//console.log('-------> ', params)

    if (src!=""&&(src && !REG_TPS.test(src))||REG_NO_TPS.test(src) && !params.isForce) {
      return src;
    } 

    //域名收敛
    var url = src&&src.replace(CDN.domainCList,DEFAULT_HOSTNAME);
    var sourceUrl = getSourceUrl(url);
      
    //对特殊处理的将不做处理
    //不处理后缀, png图片, REG_NO_EXT

    var REG_NO_DONE = REG_NO_EXT.test(url)|| /.png/.test(src);
    
    var urlParam = !REG_NO_DONE&&params.clean ? {} : (getParams(url) || {});

    var params = REG_NO_DONE ? extend(urlParam, {format: params.format}) : extend(urlParam, params || {});

    //if(!sourceUrl){return url;}

    var jpgStr = "", formatStr = "";

    if (params.size) {
      jpgStr += params.size;
      if (params.crop) {
        jpgStr += params.crop;
      }
    }
    if (params.cut) {
      jpgStr += params.cut;
    }
    if (params.circle) {
      jpgStr += params.circle;
    }
    if (params.quality) {
      jpgStr += params.quality;
    }
    if (params.rotate) {
      jpgStr += params.rotate;
    }
    if (params.sharpen) {

      jpgStr += params.sharpen;
    }
    if (jpgStr) {
      jpgStr = "_" + jpgStr + ".jpg";
    }
    if (params.format) {
      formatStr = "_." + params.format;
    }
    return sourceUrl + jpgStr + formatStr;
  }


    /**
   * 计算图片的最佳匹配网址，计算的之中会参考下面所有参数和页面的高清倍数等信息
   * @param [String] url TPS图片URL地址，如果是空字符串，则只会返回最佳匹配的后缀
   * @param [Number] [width] 图片的显示宽度像素值（如果不是自适应的），不需要考虑高清，提供页面像素值即可
   * @param [Number] [height] 图片的显示高度像素值（如果不是自适应的），不需要考虑高清，提供页面像素值即可
   * @param [Object] [params] 参数,除了下面的参数外，还支持TPS本身的参数：crop\cut\circle\rotate\sharpen
   * @param [String] [params.quality] 显示质量，如Q90
   * @param [Array]  [params.srcSize] 源图的大小,格式为[w,h],提供源图的大小有助于更精确的匹配
   * @param [Number] [params.srcRatio] 源图的宽高比w/h,,提供源图的宽高比有助于更精确的匹配
   * @param [String] [params.size] 手动设置图片的尺寸参数,格式如100x100
   * @param [String] [params.format] 手动设置格式，目前只支持"webp"
   * @param [Bool] [params.enableAutoQuality=true] 是否根据当前的放大倍数和网络参数自动设置图片质量
   * @param [Bool] [params.enableAutoSize=true] 是否根据当前的显示大小和分辨率自动设置图片的尺寸
   * @param [Bool] [params.enableAutoFormat=true] 是否自动探测webp的支持，并加上webp后缀
   * @param [Bool] [params.clean] 是否清除原网址之中的参数，如果不清除，原网址之中的参数也会继续保留和生效
   */
     function getFitUrl(src,width,height,config,isForce) {

      var params  = assign(opts,config);

      params.isForce = !!isForce;

      if (params.enableAutoSize !== false && !params.size) {
          params.size = getBestCdnSize(width,height);
      }

      if (params.enableAutoQuality !== false && !params.quality) {

          var size = (params.size && params.size.split("x")) || params.srcSize || getSize(src);//请求的图片大小
          if (size) {
            //根据图片的缩放比例调整图片质量，2倍大小时Q30即可 1倍大小时需要用Q90
            var displayWidth = width||screen.width|| 0,
              displayHeight = height ||displayWidth|| 0,
              scale = Math.min(displayWidth ? (size[0] / displayWidth) : 10000, displayHeight ? (size[1] / displayHeight) : 10000); //缩放倍数
              params.quality = "Q" + Math.max(Math.min(Math.round(7 - 3 * scale) * 25, 90), opts.q[0]);
          }
          else {
              params.quality ="Q"+ opts.q[0];
          }

      }

      !/(Q|q)/.test(params.quality)&& (params.quality = "Q"+params.quality);

      if (params.enableAutoFormat !== false && !params.format) {
          isWebp && (params.format = 'webp');
      }

      return getUrl(src,params);

    }


  (function() {

    //webp判断，整体的支持环境不依赖webp判断
    //初始化的时候执行一次
    detectWebp();

    //判断网络,整体的代码执行不依赖网络判断
    detectNetWork(function(){
          if (!isRetinaDevice) {
            //适配非retina设备下的q值,非弱网上限q90,弱网上限q75
            var q1 = parseInt(opts.q[0].slice(1));
            var q2 = parseInt(opts.q[1].slice(1));

            var highQ = (q1 + 40) >= 90 ? '90' :  (q1 + 40);
            var lowQ = q2;

            opts.q = isStrongNetWork ? [highQ] : [lowQ];

          } else {
            //弱网环境取Q30
            isStrongNetWork ?null: opts.q.reverse();
          }
    });
  })();

  /**
   * 懒加载的插件
   * lazyload.addStartListener(Crossimage.DatalazyPlugin(box))
   * @param [String] context 使用crossimage的盒子
   * @param [object] config 自定义配置
   */
  function DatalazyPlugin(context,config){
        var _self = this;
        //merge config to defaultConfig
        var $ = require("mui/zepto/zepto");

        if($.isPlainObject(context)){
          var config = context;
          var context  = document.body;
        }else if(!context){
          var context  = document.body;
        }

        return function(obj,callback){

            var isImg = obj && obj.type == 'img' && obj.src && !hasAttribute(obj.elem,"crossimage-ignore");
            var isBgImg = !isImg&&obj&& obj.type == 'bgimg' && obj.bgimgSrc&& !hasAttribute(obj.elem,"crossimage-ignore");

            // force add the Ali CDN url rule
            var isForce = isImg && hasAttribute(obj.elem,"crossimage-force");

            try{
                var img=obj.elem;

                var isContains = context&&($.contains($(context)[0],img)||img==context);


                if (isImg&&isContains || isForce) {
                    var width = obj.elem.width;
                    var height = obj.elem.height;
                    var src;
                    //兼容懒加载默认占位的符号
                    if(!!obj.elem.src&&width==1&&height==1){width=0;height=0};

                    obj.src = getFitUrl(obj.src,width,height,config, isForce);
                }
                else if (isBgImg&&isContains){
                    obj.bgimgSrc = getFitUrl(obj.bgimgSrc, obj.elem.offsetWidth ,obj.elem.offsetHeight,config);
                }
            }catch(e){
              setTimeout(() => {
                  throw e;
              },0);
            }
            callback&&callback();
        }
    }

  module.exports = {
    getFitUrl:getFitUrl,
    smartAdjustImgUrl:getFitUrl,
    adjustImgUrl:getFitUrl,
    DatalazyPlugin:DatalazyPlugin
  };





