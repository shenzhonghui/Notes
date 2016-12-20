### 迭代式模式

迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而不需要暴露该对象的内部表示

许多浏览器也支持JavaScript的Array.prototype.forEach。

迭代器分两种：内部迭代器和外部迭代器

#### jQuery中的迭代器
$.each()方法

#### 实现自己的迭代器
```JavaScript
// 实现自己的迭代器
var each = function(ary, callback){
    for(var i = 0, l=ary.length; i < l; i++){
         callback.call(null, i, ary[i]);
     }
}
// 调用迭代器
each( [ 1, 2, 3 ], function( i, n ){
    console.log([i,n]);
});
```
#### 内部迭代器
我们刚刚编写的 each 函数属于内部迭代器， each 函数的内部已经定义好了迭代规则，它完全接手整个迭代过程，外部只需要一次初始调用。
内部迭代器在调用的时候非常方便，外界不用关心迭代器内部的实现，跟迭代器的交互也仅仅是一次初始调用，但这也刚好是内部迭代器的缺点。由于内部迭代器的迭代规则已经被提前规定，上面的 each 函数就无法同时迭代 2个数组了。
#### 外部迭代器
外部迭代器必须显式地请求迭代下一个元素。

```JavaScript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <script>
        var Iterator = function( obj ){
            var current = 0;
            var next = function(){
                current += 1;
            };
            var isDone = function(){
                return current >= obj.length;
            };
            var getCurrItem = function(){
                return obj[ current ];
            };
            return {
                next: next,
                isDone: isDone,
                getCurrItem: getCurrItem
            }
        };
        // 再看看如何改写 compare 函数：
        var compare = function( iterator1, iterator2 ){
            while( !iterator1.isDone() && !iterator2.isDone() ){
                if ( iterator1.getCurrItem() !== iterator2.getCurrItem() ){
                    throw new Error ( 'iterator1 和 iti03.htmlerator2 不相等' );
                }
                iterator1.next();
                iterator2.next();
            }
            alert ( 'iterator1 和 iterator2 相等' );
        }
        var iterator1 = Iterator( [ 1, 2, 3 ] );
        var iterator2 = Iterator( [ 1, 2, 3 ] );
        compare( iterator1, iterator2 ); // 输出：iterator1 和 iterator2 相等
    </script>
</body>
</html>
```
#### 迭代类数组对象和字面量对象

迭代器模式不仅可以迭代数组，还可以迭代一些类数组的对象。比如 arguments、 {"0":'a',"1":'b'}等。
通过上面的代码可以观察到，无论是内部迭代器还是外部迭代器，只要被
迭代的聚合对象拥有 length 属性而且可以用下标访问，那它就可以被迭代。

在JavaScript中，for in语句可以用来迭代普通字面量对象的属性。
JQuery中提供$.each来封装各种迭代行为。
```JavaScript
$.each = function( obj, callback, args ) {
  //obj 是需要遍历的数组或者对象
  //callback是处理数组/对象的每个元素的回调函数，它的返回值实际会中断循环的过程
  var value,
    i = 0,
    length = obj.length,
    isArray = isArraylike( obj );//判断是不是数组,JQuery有对应的方法

  if (args ) {
    if ( isArray ) {//数组
      for ( ; i < length; i++ ) {
        value = callback.apply(obj[ i ], args );
        //相当于:
        //args = [arg1, arg2, arg3];
        //callback(args1, args2, args3)。然后callback里边的this指向了obj[i]

        if ( value === false ) {
          //注意到，当callback函数返回值会false的时候，注意是全等！循环结束
          break;
        }
      }
    } else {//非数组
      for ( i in obj ) {//遍历对象的做法
        value = callback.apply( obj[ i ], args );

        if ( value === false ) {
          break;
        }
      }
    }

  // A special, fast, case for the most common use of each
  } else {
    if ( isArray ) {
      for ( ; i < length; i++ ) {
        value = callback.call( obj[ i ], i, obj[ i ] );
        //相当于callback(i, obj[i])。然后callback里边的this指向了obj[i]

        if ( value === false ) {
            break;
          }
        }
      } else {
        for ( i in obj ) {
          value = callback.call( obj[ i ], i, obj[ i ] );

          if ( value === false ) {
            break;
          }
        }
      }
    }

  return obj;
}
```
##### 倒序迭代器
```JavaScript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <script>
        //倒序迭代器
        var reverseEach = function( ary, callback ){
            for ( var l = ary.length - 1; l >= 0; l-- ){
                callback( l, ary[ l ] );
            }
        };
        reverseEach( [ 0, 1, 2 ], function( i, n ){
            console.log( n ); // 分别输出：2, 1 ,0
        });
    </script>
</body>
</html>
```
##### 中止迭代器
```JavaScript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <script>
        //中止迭代器
        var each = function( ary, callback ){
            for ( var i = 0, l = ary.length; i < l; i++ ){
                if ( callback( i, ary[ i ] ) === false ){ // callback 的执行结果返回 false，提前终止迭代
                    break;
                }
            }
        };
        each( [ 1, 2, 3, 4, 5 ], function( i, n ){
            if ( n > 3 ){ // n 大于 3 的时候终止循环
                return false;
            }
            console.log( n ); // 分别输出：1, 2, 3
        });
    </script>
</body>
</html>
```
