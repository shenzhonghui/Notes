#### jQuery 中的扩展方法

1 jQuery.extend(object),为扩展jQuery 类本身，为类添加新的静态方法

2 jQuery.fn.extend(object), 给 jQuery 对象添加实例方法，也就是通过这个 extend 添加的新方法，实例化的 jQuery 对象都能使用，因为它是挂载在 jQuery.fn 上的方法（上文有提到，jQuery.fn = jQuery.prototype ）

官方解释：

1）jQuery.extend(): 把两个或者更多的对象合并到第一个当中，

2）jQuery.fn.extend()：把对象挂载到 jQuery 的 prototype 属性，来扩展一个新的 jQuery 实例方法。

也就是说，使用 jQuery.extend() 拓展的静态方法，我们可以直接使用 $.xxx 进行调用（xxx是拓展的方法名），

而使用 jQuery.fn.extend() 拓展的实例方法，需要使用 $().xxx 调用。


#### jQuery 的链式调用及回溯

jQuery 完整的链式调用、增栈、回溯通过 return this 、 return this.pushStack() 、return this.prevObject 实现，看看源码实现：

```javascript

jQuery.fn = jQuery.prototype = {
    // 将一个 DOM 元素集合加入到 jQuery 栈
    // 此方法在 jQuery 的 DOM 操作中被频繁的使用, 如在 parent(), find(), filter() 中
    // pushStack() 方法通过改变一个 jQuery 对象的 prevObject 属性来跟踪链式调用中前一个方法返回的 DOM 结果集合
    // 当我们在链式调用 end() 方法后, 内部就返回当前 jQuery 对象的 prevObject 属性
    pushStack: function(elems) {
        // 构建一个新的jQuery对象，无参的 this.constructor()，只是返回引用this
        // jQuery.merge 把 elems 节点合并到新的 jQuery 对象
        // this.constructor 就是 jQuery 的构造函数 jQuery.fn.init，所以 this.constructor() 返回一个 jQuery 对象
        // 由于 jQuery.merge 函数返回的对象是第二个函数附加到第一个上面，所以 ret 也是一个 jQuery 对象，这里可以解释为什么 pushStack 出入的 DOM 对象也可以用 CSS 方法进行操作
        var ret = jQuery.merge(this.constructor(), elems);

        // 给返回的新 jQuery 对象添加属性 prevObject
        // 所以也就是为什么通过 prevObject 能取到上一个合集的引用了
        ret.prevObject = this;
        ret.context = this.context;

        // Return the newly-formed element set
        return ret;
    },
    // 回溯链式调用的上一个对象
    end: function() {
        // 回溯的关键是返回 prevObject 属性
        // 而 prevObject 属性保存了上一步操作的 jQuery 对象集合
        return this.prevObject || this.constructor(null);
    },
    // 取当前 jQuery 对象的第 i 个
    eq: function(i) {
        // jQuery 对象集合的长度
        var len = this.length,
            j = +i + (i < 0 ? len : 0);

        // 利用 pushStack 返回
        return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
    },
}
```

#### jQuery 中的  短路表达式 与 多重短路表达式

** 短路表达式 ** ：作为"&&"和"||"操作符的操作数表达式，这些表达式在进行求值时，只要最终的结果已经可以确定是真或假，求值过程便告终止，这称之为短路求值。这是这两个操作符的一个重要属性。

```javascript
// ||短路表达式
var foo = a || b;
// 相当于
if(a){
    foo = a;
}else{
    foo = b;
}

// &&短路表达式
var bar = a && b;
// 相当于
if(a){
    bar = b;
}else{
    bar = a;
}
```

多重短路表达式和简单短路表达式其实一样，只需要先把后面的当成一个整体，依次推进，得出最终值。

```javascript
var a = 1, b = 0, c = 3;

var foo = a && b && c, // 0 ,相当于 a && (b && c)
  bar = a || b || c;  // 1
```

1、在 Javascript 的逻辑运算中，0、""、null、false、undefined、NaN 都会判定为 false ，而其他都为 true ；

2、因为 Javascript 的内置弱类型域 (weak-typing domain)，所以对严格的输入验证这一点不太在意，即便使用 && 或者 || 运算符的运算数不是布尔值，仍然可以将它看作布尔运算。虽然如此，还是建议如下：

```javascript
if(foo){ ... }     //不够严谨
if(!!foo){ ... }   //更为严谨，!!可将其他类型的值转换为boolean类型
```
#### 钩子机制（hook）

钩子是编程惯用的一种手法，用来解决一种或多种特殊情况的处理。
简单来说，钩子就是适配器原理，或者说是表驱动原理，我们预先定义了一些钩子，在正常的代码逻辑中使用钩子去适配一些特殊的属性，样式或事件，这样可以让我们少写很多 else if 语句。

jQuery 的 on() 方法可以注册事件处理器。和 CSS() 一样它也可以接收一组映射格式的事件，但更进一步地，它允许单一处理器可以被多个事件注册：

```javascript
// binding events by passing a map
jQuery("#some-selector").on({
  "click" : myClickHandler,
  "keyup" : myKeyupHandler,
  "change" : myChangeHandler
});

// binding a handler to multiple events:
jQuery("#some-selector").on("click keyup change", myEventHandler);
```
#### setTimeout in Jquery

熟悉 jQuery 的人都知道 DOM Ready 事件，传Javascript原生的 window.onload 事件是在页面所有的资源都加载完毕后触发的。如果页面上有大图片等资源响应缓慢, 会导致 window.onload 事件迟迟无法触发，所以出现了DOM Ready 事件。
此事件在 DOM 文档结构准备完毕后触发，即在资源加载前触发。另外我们需要在 DOM 准备完毕后，再修改DOM结构，比如添加DOM元素等。而为了完美实现 DOM Ready 事件，兼容各浏览器及低版本IE（针对高级的浏览器，可以使用 DOMContentLoaded 事件，省时省力），在 jQuery.ready() 方法里，运用了 setTimeout() 方法的一个特性， 在 setTimeout 中触发的函数, 一定是在 DOM 准备完毕后触发。

不带时间参数的 setTimeout(a) 相当于 setTimeout(a,0)
