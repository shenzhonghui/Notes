### javascript中的类

类相当于实例的原型， 所有在类中定义的方法， 都会被实例继承。
如果在一个方法前， 加上static关键字， 就表示该方法不会被实例继承， 而是直接通过类来调用， 这就称为“ 静态方法”。
```javascript
class Foo {  
  static classMethod() {  
    return 'hello';  
  }  
}  
Foo.classMethod() // 'hello'  
var foo = new Foo();  
foo.classMethod()  
// TypeError: foo.classMethod is not a function  
```
上面代码中， Foo类的classMethod方法前有static关键字， 表明该方法是一个静态方法， 可以直接在Foo类上调用（ Foo.classMethod()）， 而不是在Foo类的实例上调用。 如果在实例上调用静态方法， 会抛出一个错误， 表示不存在该方法。
** 父类的静态方法， 可以被子类继承。**
---

```javascript
class Foo {  
  static classMethod() {  
    return 'hello';  
  }  
}  
class Bar extends Foo {}  
Bar.classMethod(); // 'hello'
```
上面代码中， 父类Foo有一个静态方法， 子类Bar可以调用这个方法。

静态方法也是可以从super对象上调用的。

```javascript
class Foo {  
    static classMethod() {  
        return 'hello';  
    }  
}  
class Bar extends Foo {  
    static classMethod() {  
        return super.classMethod() + ', too';  
    }  
}  
Bar.classMethod();  
```
静态属性

静态属性指的是 Class 本身的属性， 即Class.propname， 而不是定义在实例对象（ this） 上的属性。

```javascript
class Foo {}  
Foo.prop = 1;  
Foo.prop // 1  
```
上面的写法为Foo类定义了一个静态属性prop。
目前， 只有这种写法可行， 因为 ES6 明确规定， Class 内部只有静态方法， 没有静态属性。

```javascript

```
