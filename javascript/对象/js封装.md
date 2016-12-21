### js封装

#### 封装数据
JavaScript 没有提供对这些关public 和 private 关键字，我们只能依赖变量的作用域来实现public和 private封装特性，

ES6提供了let来提供

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
