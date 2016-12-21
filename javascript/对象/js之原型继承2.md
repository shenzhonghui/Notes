### js之原型和原型链
参考文章：http://coolcao.com/2016/11/24/you-dont-konw-js-s08-prototype/
#### 原型对象

无论什么时候，只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个prototype属性，这个属性指向函数的原型对象。
![原型图](http://oayhezji6.bkt.clouddn.com/js_prototype.png)

Person为构造函数，其有一个属性prototype，指向其原型对象。
Person Prototype为Person的原型对象，其必有一个属性constructor，指向Person
person1,person2为两个实例对象，都有一个属性[[prototype]]，指向其构造函数的原型对象。
>注意：实例对象没有constructor属性，如果直接person1.constructor，则返回的是其原型对象上的contructor指向，即Person构造函数。

[[Prototype]]

Javascript中的对象有一个特殊的[[Prototype]]属性，其实就是对于其他对象的引用。几乎所有的对象在创建时[[Prototype]]属性都会被赋予一个非空的值。
```javascript
var obj = {
  name:'shen'
}
var obj1 = Object.create(obj);
console.log(obj1.name); //shen
```
> Object.create()会创建一个对象，并把这个对象的[[Prototype]]关联到指定对象。

#### 构造函数
##### 构造函数还是调用
```javascript
var SayHello = function(){
    console.log('hello');
}
var obj = new SayHello();
console.log(obj); //SayHello {}
```
SayHello本身是一个函数，但使用new关键字调用后会创建一个对象，并赋值给obj，但此时obj为空对象。

```javascript
var SayHello = function SayHello(){
  return function(){
    console.log('hello');
  }
}
var obj = new SayHello();
console.log(obj); //[Function]
obj();    //hello
```
同样，这里SayHello还是一个函数，只是使用return返回了一个函数，当使用new调用时，这时返回的是一个函数（js里函数也是对象嘛），我们继续调用obj()实际上是调用SayHello内部返回的函数。

#### 原型继承
```javascript
function Foo(name){
  this.name = name;
}
Foo.prototype.myName = function(){
  return this.name;
}
function Bar(name,label){
  Foo.call(this,name);
  this.label = label;
}
Bar.prototype = Object.create(Foo.prototype);
Bar.prototype.myLabel = function(){
  return this.label;
}
var a = new Bar('a','obj a');
a.myName(); //a
a.myLabel();  //'obj a'
```
注意：下面两种方式是常见的错误：

```javascript
//和你想要的不一样
Bar.property = Foo.prototype;
//基本上满足你的要求，但是可能会产生一些副作用
Bar.prototype = new Foo();
```
Bar.property = Foo.property并不会创建一个关联到Bar.prototype的新对象，它只是让Bar.property直接引用Foo.prototype对象。因此，再定义 Bar.property.myLabel时，相当于影响了 Foo.prototype对象，这不是我们想要的。
Bar.property = new Foo()的确会创建一个关联到Bar.prototype的新对象。但是它使用了Foo()的构造函数调用，如果函数Foo有一些副作用（比如写日志，修改状态，注册到其他对象，给this添加数据属性等）的话，就会影响到Bar()的“后代”。

因此，要创建一个适合的关联对象，必须使用Object.create()，而不是使用构造函数Foo()。

instanceof,isPrototypeOf()，Object.getPrototypeOf()之间的区别
```javascript
var Animal = function (name) {
    this.name = name;
    this.sayHi = function () {
        console.log('hello,I\'m ' + this.name + ',and I\'m a ' + this.type);
    }
}
var Dog = function (name) {
    Animal.call(this,name);
    this.type = 'dog';
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
var dog = new Dog('biubiu');
```
