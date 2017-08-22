### js封装

#### 封装数据
在许多语言的对象系统中，封装数据是由语法来实解析来实现的，这些语言也许提供了 private、public、protected 等关键字来提供不同的访问权限。

但是JavaScript 没有提供对这些关public 和 private 关键字，我们只能依赖变量的作用域来实现public和 private封装特性，

除了 ECMAScript6 中提供的 let 之外，一般我们通过函数来创建作用域:

```javascript
var myObject = (function(){
    var __name = 'sven'; //  私有private属性  
    return {
        getName: function(){// 公开public方法
            return __name;
        }
    }
})();
console.log( myObject.getName() ); // :sven
console.log( myObject.__name ); // :undefined
```
另外值得一提的是，在ECAMScript 6中，还可以通过Symbol创建私有属性。
