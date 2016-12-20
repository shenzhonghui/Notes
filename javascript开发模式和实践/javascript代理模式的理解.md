
代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。

##### 保护代理和虚拟代理

**保护代理**用于控制不同权限的对象对目标对象的访问，但在 JavaScript中 并不容易实现保护代理，因为我们无法判断谁访问了某个对象。
而**虚拟代理**把一些开销很大的对象，延迟到真正需要它的时候才去创建，比较常用。

##### 虚拟代理实现图片预加载

在Web开发中，图片预加载 是一种常用的技术，如果直接给某个img标签节点设置src属性，  由于图片过大或者网络不好，图片的位置往往有段时间会是一 空白。常见的做法是先用一张loading 图 占位，然后用异步的方式加载图 ，等图 加载好了再把它填充到 img 节点里，这种 场景就很适合使用虚拟代理。

```JavaScript
var myImage = (function () {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);

    return {
        setSrc: function (src) {
            imgNode.src = src;
        }
    }
})();

var proxyImage = (function(){
    var img = new Image;
    img.onload = function(){
        myImage.setSrc( this.src );
    }
    return {
        setSrc: function( src ){
            myImage.setSrc( 'file:// /C:/Users/svenzeng/Desktop/loading.gif' );
            img.src = src;
        }
    }
})();
proxyImage.setSrc( 'http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg' );
```

#### 虚拟代理合并http请求

我们可以通过一个代理函数proxySynchronousFile来收集一段时间之内的请求， 最后一次性发送给服务器。比如我们等待2秒之后才把需要同步的ID打包发送给服务器，如果不是对实时性要求非常高的系统，2秒的延迟不会带来更多的副作用，却能大大减轻服务器的压力。

```HTML
<body>
    <input type="checkbox" id="1"></input>1
    <input type="checkbox" id="2"></input>2
    <input type="checkbox" id="3"></input>3
    <input type="checkbox" id="4"></input>4
    <input type="checkbox" id="5"></input>5
</body>
```
```JavaScript
var synchronousFile = function( id ){
    console.log( '开始    ，id : ' + id );
};

var proxySynchronousFile = (function(){
    var cache = []; //保存一段时间内需要上传的ID
    var timer = null;// 定时器

    return function(id) {
        cache.push（id);
        if(timer) {
            return;
        }
        timer = setTimeout(function(){
            synchronousFile(cache.join( ',' ));// 以逗号分隔id上传;
            clearTimeout(timer);
            timer=null;
            cache.length=0;//清空id集合
        },2000)
    }    
})()；

//操作checkbox输入框





```
