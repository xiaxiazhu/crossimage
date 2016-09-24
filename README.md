## CrossImage

CrossImage是一个天猫前端与核心系统部合作出品的插件。
它结合cdn的缩放参数和屏幕情况，自动加载最适合的图片，节省流程，提高用户体验，同时也降低了开发成本。


* Change Log
  * v3.1.0 结合mui/lib/tps 重新升级组件
     * 对原有的方法支持基础上,重新升级了API
     
  * v2.0
     * 响应集团安全要求，迁移到tnpm
     * 组件去kissy化
  * v1.0
     * **[升级用户请关注]修改了crossimage-ignore相关属性的名称**
     * **[升级用户请关注]adjustImage的参数API做了修改**
     * 新增对Wx10000这种只处理一条边长的图片进行支持
     * 为组件增加单元测试 

## 相关背景

   * 推荐阅读：[ATA文章：新时代的响应式图片](http://www.atatech.org/articles/18424)
   * CDN提供了不同后缀的图片适配调整功能：[内网TFS百科](http://baike.corp.taobao.com/index.php/CS_RD/tfs/http_server#.E5.B0.BA.E5.AF.B8.E7.94.B3.E8.AF.B7.E6.B5.81.E7.A8.8B)
   * ipad / Retina Macbook / 各种移动端 ，屏幕PPI不一致。高清化的场景下，需要图片自动适配？
   * 想尝试高性价比的[webp图片](https://developers.google.com/speed/webp/)，还要担心兼容性？能不能根据浏览器环境全自动？
   * **为了解决上述问题，天猫前端与核心系统部合作出品```cross image```组件，它力求能在跨终端的场景下完成图片适配，并降低前端同学的开发成本。**
   * ![功能结构图](http://gtms01.alicdn.com/tps/i1/T14TEnFKxbXXaJE4Yg-1027-382.png_720x720.jpg)
   
## 功能和原理

   * 插件内置了所有CDN支持的参数列表，会将用户的期望尺寸、屏幕参数、CDN参数进行匹配，找到最合适的尺寸后缀

   * 如果图片是HTML同步输出在页面上，不是异步载入，怎么处理？
     * JS组件不适合这种场景
     * [同步图片处理](gitlab.alibaba-inc.com/xingsheng.fxs/crossimage)

## 方法
   ```
   Crossimage.getFitUrl(src,width,height,params);

   ```
   * 计算图片的最佳匹配网址，计算的之中会参考下面所有参数和页面的高清倍数等信息
   * @param [String] url TPS图片URL地址，如果是空字符串("")，则只会返回最佳匹配的后缀
   * @param [Number] [width] 图片的显示宽度像素值（如果不是自适应的），不需要考虑高清，提供页面像素值即可
   * @param [Number] [height] 图片的显示高度像素值（如果不是自适应的），不需要考虑高清，提供页面像素值即可
   * @param [Object] [params] 参数,除了下面的参数外，还支持TPS本身的参数：crop\cut\circle\rotate\sharpen
   * @param [Array]  [params.srcSize] 源图的大小,格式为[w,h],提供源图的大小有助于更精确的匹配
   * @param [Number] [params.srcRatio] 源图的宽高比w/h,,提供源图的宽高比有助于更精确的匹配
   * @param [String] [params.size] 手动设置图片的尺寸参数,格式如100x100
   * @param [String] [params.cut] 手动设置剪裁"xz";注此参数只有部分尺寸参数支持。请慎用
   * @param [String] [params.circle] 手动设置内切圆"co0"
   * @param [String] [params.quality] 显示质量，如Q90
   * @param [String] [params.rotate] 手动设置格式"_g"
   * @param [String] [params.sharpen] 手动设置锐化率"s50"
   * @param [String] [params.crop] 手动设置格式
   * @param [Bool] [params.enableAutoQuality=true] 是否根据当前的放大倍数和网络参数自动设置图片质量
   * @param [Bool] [params.enableAutoSize=true] 是否根据当前的显示大小和分辨率自动设置图片的尺寸
   * @param [Bool] [params.enableAutoFormat=true] 是否自动探测webp的支持，并加上webp后缀
   * @param [Bool] [params.clean] 是否清除原网址之中的参数，如果不清除，原网址之中的参数也会继续保留和生效
   


## 作为DataLazyload插件使用
### Step 1. img标签的规范
   
   * 如需跳过某些图片的自动适配，可以申明```crossimage-ignore```属性，组件将不处理这张图片
   
   ```
   <img crossimage-ignore data-ks-lazyload="http://gi2.md.alicdn.com/bao/uploadedi4/1804033223/T2nFegXFVaXXXXXXXX_!!1804033223.jpg" width="150" height="150" alt="测试图片"/>
   ```

### Step 2. 引入DataLazyload和CrossImage，把CrossImage添加到DataLazyload的addStartListener时间队列中
   * Sample

   ```
    var DataLazyload = require('mui/datalazyload/index)
    var Crossimage = require("mui/crossimage/index")

    //datalazyLoad插件，使用默认配置
    var lazy = DataLazyload.instance()
        lazy.addStartListener(Crossimage.DatalazyPlugin(box,config))
        lazy.addElements(box)

   ```
   * 无论原src带了何种参数后缀，都会被忽略并重新处理
   * 支持给DatalazyPlugin()初始化的时候传入配置params
   * 其他问题：请联系作者 清田

## 默认图片质量（q参数）调整策略
* 客户端环境，非wifi,4G网络 - Q30
* 高清屏幕，jpg图片 - Q30
* 默认参数 - Q50

## [斑马同步图片处理](gitlab.alibaba-inc.com/xingsheng.fxs/crossimage)