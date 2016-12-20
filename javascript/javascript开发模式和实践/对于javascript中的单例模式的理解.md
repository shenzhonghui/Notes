1 基本概念

单例模式的定义是:**保证一个类仅有一个实例，并提供一个访问它的全局访问点。**

单例模式很常用，有些对象我们只要一个，比如比如线程池、全局缓存、浏 览器中的 window 对象等。

在 JavaScript 开发中，单例模式的用途同样非常广泛。试想一下，当我 们单击登录按钮的时候，页面中会出现一个登录浮窗，而这个登录浮窗是唯一的，无论单击多少 次登录按钮，这个浮窗都只会被创建一次，那么这个登录浮窗就适合用单例模式来创建。

##### 用代理实现单例模式

```javascript
// 一个简单的类
var CreateDiv = function (html) {
    this.html = html;
    this.init();
}

CreateDiv.prototype.init = function () {
    var oDiv = document.creatElement('div');
    oDiv.innerHtml = this.html;
    document.body.appendChild(oDiv);
}
// 我们这里引入代理类 proxySingletonCreateDiv

var proxySingletonCreateDiv = (function(
    var instance;// 未赋值instance初始值为undefined
    return function (html) {
        if (!instance) {
            instance = new CreateDiv(html);
        }
        return instance;
    }
    
))()

// 实例化代理类
var a = new ProxySingletonCreateDiv( 'sven1' ); 
var b = new ProxySingletonCreateDiv( 'sven2' );
alert(a === b);
```
通过引入代理类的方式，我们同样完成了一个单例模式的编写，跟之前不同的是，现在我们 把负责管理单例的逻辑移到了代理类 proxySingletonCreateDiv 中。这样一来，CreateDiv 就变成了 一个普通的类，它跟 proxySingletonCreateDiv 组合起来可以达到单例模式的效果。
本例是**缓存代理**的应用之一
在上述代码中，代理类ProxySingletonCreateDiv通过自动执行函数将变量instance缓存在方法中，故此处理解为缓存代理。

##### Javascript中的单例模式

单例模式的核心是确保只有一个实例，并提供全局访问。

全局变量不是单例模式，但在 JavaScript 开发中，我们经常会把全局变量当成单例来使用。
例如:
var a = {};

###### 1 使用命名空间

最简单的方法依然是用对象字面量的方式:
```
var namespace1 = { 
    a: function(){ 
        alert (1);
    },
    b: function(){
        alert (2); 
    }
};
```
还可以动态地创建命名空间

```
var MyApp = {};
MyApp.namespace = function( name ){ 
    var parts = name.split( '.' );
    var current = MyApp;
    for ( var i in parts ){
        if ( !current[ parts[ i ] ] ){ 
        current[ parts[ i ] ] = {};
    }
    current = current[ parts[ i ] ];
} };
MyApp.namespace( 'event' ); 
MyApp.namespace( 'dom.style' );
console.dir( MyApp ); // 上述代码等价于:
var MyApp = { 
    event: {},
    dom: {
        style: {}
    } 
};
```
2 使用闭包封装私有变量

这种方法把一些变量封装在闭包的内部，只暴露一些接口跟外界通信:

```
var user = (function(){ 
    var __name = 'sven',
        __age = 29;
    return {
        getUserInfo: function(){
            return __name + '-' + __age; 
        }
    } 
})();
```
我们用下划线来约定私有变量__name 和__age，它们被封装在闭包产生的作用域中，外部是 访问不到这两个变量的，这就避免了对全局的命令污染。

#### 惰性单例

惰性单例是需要的时候才创建对象实例，

惰性单例是原型单例模式的重点，

例子中我们实现一个webQQ的登录弹窗，有几个要点：
* 只有一个弹窗，
* 弹窗只创建一次
* 需要的时候才创建

第一种实现方法是在页面加载完成的时候，自动创建弹窗的div，点击时显示即可 


```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>web qq</title>
</head>
<body>
	<button id="loginBtn">登录</button>
	<script type="text/javascript">
		var loginLayer = (function(){
			var div = document.createElement( 'div' ); 
			div.innerHTML = '我是登录浮窗'; 
			div.style.display = 'none'; 
			document.body.appendChild( div );
			return div; 
		})();
		document.getElementById( 'loginBtn' ).onclick = function(){
			loginLayer.style.display = 'block'
		}
	</script>
</body>
</html>
```
缺点：也许我们进入 WebQQ 只是玩玩游戏或者看看天气，根本不需要进行 2 登录操作，因为登录浮窗总是一开始就被创建好，那么很有可能将白白浪费一些 DOM 节点。

修改js代码：

```
<script type="text/javascript">
	var createLoginLayer = function(){
		var div = document.createElement( 'div' ); 
		div.innerHTML = '我是登录浮窗'; 
		div.style.display = 'none'; 
		document.body.appendChild( div );
		return div; 
	};
	document.getElementById( 'loginBtn' ).onclick = function(){
	    var loginLayer = createLoginLayer();
		loginLayer.style.display = 'block'
	}
</script>
```
缺点：虽然现在达到了惰性的目的，但失去了单例的效果。当我们每次点击登录按钮的时候，都会 创建一个新的登录浮窗 div。虽然我们可以在点击浮窗上的关闭按钮时(此处未实现)把这个浮 窗从页面中删除掉，但这样频繁地创建和删除节点明显是不合理的，也是不必要的。

也许读者已经想到了，我们可以用一个变量来判断是否已经创建过登录浮窗，这也是本节第 一段代码中的做法:

```
var createLoginLayer = (function(){ 
    var div;
    return function(){ 
        if(!div){
            div = document.createElement( 'div' );
            div.innerHTML = '我是登录浮窗';
            div.style.display = 'none';
            document.body.appendChild( div );
        }
        return div; 
    }
})();
document.getElementById( 'loginBtn' ).onclick = function(){
	    var loginLayer = createLoginLayer();
		loginLayer.style.display = 'block'
	}
 
```
#### 通用的惰性单例

* 上述代码仍然是违反单一职责原则的，创建对象和管理单例的逻辑都放在 createLoginLayer 对象内部。
* 如果我们下次需要创建页面中唯一的 iframe，或者 script 标签，用来跨域请求数据，就 必须得如法炮制，把 createLoginLayer 函数几乎照抄一遍:

```
var createIframe= (function(){ var iframe;
    return function(){
        if ( !iframe){
            iframe= document.createElement( 'iframe' );
            iframe.style.display = 'none';
            document.body.appendChild( iframe);
        }
        return iframe; 
    }
})();
```
我们需要把不变的部分隔离出来，先不考虑创建一个 div 和创建一个 iframe 有多少差异，管 理单例的逻辑其实是完全可以抽象出来的，这些逻辑被封装在 getSingle 函数内部，创建对象的方法 fn 被当成参数动态传入 getSingle 函数:

```
var getSingle = function( fn ){
        var result;
        return function(){
            return result || ( result = fn .apply(this, arguments ) );
        } 
};
```
接下来将用于创建登录浮窗的方法用参数 fn 的形式传入 getSingle，我们不仅可以传入 createLoginLayer，还能传入 createScript、createIframe、createXhr 等。之后再让 getSingle 返回 一个新的函数，并且用一个变量 result 来保存 fn 的计算结果。result 变量因为身在闭包中，它永远不会被销毁。


这种单例模式的用途远不止创建对象，比如我们通常渲染完页面中的一个列表之后，接下来 9 要给这个列表绑定 click 事件，如果是通过 ajax 动态往列表里追加数据，在使用事件代理的前提
下，click 事件实际上只需要在第一次渲染列表的时候被绑定一次，但是我们不想去判断当前是 否是第一次渲染列表，如果借助于 jQuery，我们通常选择给节点绑定 one 事件:

```
var bindEvent = function(){
    $( 'div' ).one( 'click', function(){
        alert ( 'click' ); 
        
    });
};
var render = function(){ 
    console.log( '开始渲染列表' ); 
    bindEvent();
}; 
render();
render();
render();
```
如果利用 getSingle 函数，也能达到一样的效果。代码如下:

```
var bindEvent = getSingle(function(){
    document.getElementById( 'div1' ).onclick = function(){
        alert ( 'click' ); 
        
    }
    return true;
});
var render = function(){ 
    console.log( '开始渲染列表' ); 
    bindEvent();
}; 
render();
render();
render();
```
可以看到，render 函数和 bindEvent 函数都分别执行了 3 次，但 div 实际上只被绑定了一个 事件。



