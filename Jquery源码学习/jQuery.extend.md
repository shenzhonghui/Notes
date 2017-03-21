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
