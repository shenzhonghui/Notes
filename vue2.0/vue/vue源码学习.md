### vue2.0源码学习

原文：http://www.open-open.com/lib/view/open1479266957934.html

![vue2生命周期](http://oayhezji6.bkt.clouddn.com/vue2%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
从图中我们可以看出，生命周期主要分为4个过程：
* create。 new Vue 时，会先进行create，创建出Vue对象。

* mount。根据el, template, render方法等属性，会生成DOM，并添加到对应位置。
* update。当数据发生变化后，会重新渲染DOM，并进行替换。
* destory。销毁时运行。

![vue源码解析](http://oayhezji6.bkt.clouddn.com/vue%E6%BA%90%E7%A0%81%E7%BB%93%E6%9E%84%28%E7%BD%91%E5%8F%8B%E7%90%86%E8%A7%A3%E9%9D%9E%E5%AE%98%E6%96%B9%29)

new Vue的过程主要涉及到三个对象：vm、compiler、watcher。其中，vm表示Vue的具体对象；compiler负责将template解析为AST render方法；watcher用于观察数据变化，以实现数据变化后进行re-render。
