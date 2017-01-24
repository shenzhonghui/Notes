### Array.prototype.slice.call(arguments)
---
原文地址： http://www.cnblogs.com/littledu/archive/2012/05/19/2508672.html

Array.prototype.slice.call(arguments)能将具有length属性的对象转成数组，除了IE下的节点集合（因为ie下的dom对象是以com对象的形式实现的，js对象与com对象不能进行转换）

```javascript
// 前提是必须有length属性
let a={length:2,0:'first',1:'second'};
Array.prototype.slice.call(a)//  ["first", "second"]
let a={length: 2}
Array.prototype.slice.call(a)//  [undefined, undefined]

```
Array.prototype.slice.call(arguments)能够将arguments转成数组，那么就是arguments.toArray().slice();到这里，是不是就可以说Array.prototype.slice.call(arguments)的过程就是先将传入进来的第一个参数转为数组，再调用slice？

提醒一下，这两个是相等的：[].slice === Array.prototype.slice
再看call的用法，如下例子

```javascript

var a = function(){
     console.log(this);    // 'littledu'
     console.log(typeof this);      //  Object
     console.log(this instanceof String);    // true
}
a.call('littledu');
```
可以看出，call了后，就把当前函数推入所传参数的作用域中去了，不知道这样说对不对，但反正this就指向了所传进去的对象就肯定的了。
到这里，基本就差不多了，我们可以大胆猜一下slice的内部实现，如下

```javascript
Array.prototype.slice = function(start,end){
     var result = new Array();
     start = start || 0;
     end = end || this.length; //this指向调用的对象，当用了call后，能够改变this的指向，也就是指向传进来的对象，这是关键
     for(var i = start; i < end; i++){
          result.push(this[i]);
     }
     return result;
}

```
附个转成数组的通用函数

```javascript
function toArray(obj, offset) {
  offset = offset >= 0 ? offset : 0
  // es6 的写法
  if (Array.from) {
    return Array.from(obj).slice(offset)
  }
  return Array.prototype.slice.call(obj, offset)
}
```
