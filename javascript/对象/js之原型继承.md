### js之原型继承

#### 原型模式和基于原型继承的javascript对象系统

Brendan Eich ：javascript作者
在 Brendan Eich 为 JavaScript 设计面向对象系统时，借鉴了 Self 和 Smalltalk 这两门基于原型的语言。
之所以选择基于原型的面向对象系统，并不是因为时间匆忙，是由于它设计起来相对简单，而因为从一开始 Brendan Eich 就没有打算在 JavaScript 中加入类的概念。

在以类为中心的面向对象编程语言中，类和对象的关系可以想象成铸模和铸件的关系，对象 总是从类中创建而来。而在原型编程的思想中，类并不是必需的，对象未必需要从类中创建而来， 一个对象是通过克隆另外一个对象所得到的。

原型模式的实现关键，是语言本身是否提供了clone方法。ECMAScript 5 提供了 Object.create 方法，可以用来克隆对象。代码如下:
```javascript
var Plane =function () {
    this.blood = 100;
    this.attackLevel = 1;
    this.defenseLevel = 1;
}
var plane = new Plane();
plane.blood = 500;
plane.attackLevel = 10;
plane.defenseLevel = 7;
var clonePlane = Object.create(plane);
console.log( clonePlane );
```
##### 1  所有的数据都是对象
JavaScript 在设计的时候，模仿Java 引入了两种类型机制:基本类型和对象类型。基本类型包括undefined、number、boolean、string、function、object。从现在看来，这并不是一个好的想法。

按照 JavaScript 设计者的本意，除了 undefined 之外，一切都应是对象。为了实现这一目标， number、boolean、string 这几种基本类型数据也可以通过“包装类”的方式变成对象类型数据来处理。

我们不能说在JavaScript中所有的数据都是对象，但可以说绝大部分数据都是对象。那么相信在 JavaScript 中也一定会有一个根对象存在，这些对象追根溯源都来 于这个根对象。

JavaScript 的函数既可以作为普通函数被调用，也可以作为构造器被调用。当使用 new运算符来调用函数时，此时的函数就是一个构造器。 用
事实上，JavaScript 中的根对象是 Object.prototype 对象。
Object.prototype 对象是一个空的 对象。我们在 JavaScript见到的每个对象，实际上都是从 Object.prototype 对象克隆而来的， **Object.prototype 对象就是它们的原型**
##### 2 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型 并克隆它。            
new运算符来创建对象的过程，实际上也只是先克隆Object.prototype 对象，再进行一些其他额外的操作的过程。（具体不需要了解）
在 Chrome 和 Firefox 等向外暴露了对象__proto__属性的浏览器下
下面的代码来理解new操作符的作用：
```javascript
function Person( name ){
    this.name = name;
};
Person.prototype.getName = function(){
    return this.name;
};
var objectFactory = function(){
    var obj = new Object(), // 从Object.prototype上克隆一个空的对象
    Constructor = [].shift.call( arguments ); //取得外部传入的构造器，本例是 Person
    obj.__proto__ = Constructor.prototype; // 指向正确的原型
    var ret = Constructor.apply( obj, arguments );// 借用外部传入的构造器给obj设置属性
    return typeof ret === 'object' ? ret : obj;// 确保构造器总是返回一个对象
}
var a = objectFactory( Person, 'sven' );
console.log( a.name );
console.log( a.getName() );
console.log( Object.getPrototypeOf( a ) === Person.prototype );


```
##### 4  如果对象无法响应某个请求，它会把这个请求委托给它的构造器的原型

实际上，虽然 JavaScript 的对象最初都是  Object.prototype 对象克隆而来的，但对象构造 器的原型并不仅限于 Object.prototype 上，而是可以动态指向其他对象。这样一来，当对象a需要借用对象 b 的能力时，可以有选择性地把对象 a 的构造器的原型指向对象 b，从而达到继承的 效果。
下面的代码是我们最常用的原型继承方式:
```javascript
var obj={
    name:'sevn'
}\
var A=function(){};
A.prototype = obj;
var a = new A();
console.log( a.name );
```
上述代码中我们看看引擎做了哪些工作？
* 首先， 尝试遍历对象a中的所有属性，但没有找到 name 这个属性
* 寻找name 属性的这个请求被委托给对象a的构造器的原型，它被 a.__proto__ 记录并且
指向 A.prototype，而 A.prototype 被设置为对象 obj。
* 在对象 obj 中 到了 name 属性，并返回它的值

当我们期望得到一个“类”继承自另外一个“类”的效果时，往往会用下面的代码来模拟实现：
```javascript
var A = function(){};
A.prototype = {
    name: 'sven'
};
var B = function(){};
B.prototype = new A();// 把实例化后对象A赋给B的原型，BB就继承了A的所有属性
var b = new B();
console.log( b.name ); //   :sven
```
上述代码中我们看看引擎做了哪些工作？
* 首先， 尝试遍历对象b中的所有属性，但没有找到 name 这个属性
*   查找name 属性的请求被委托给对象 b 的构造器的原型，它被 b.__proto__  录 并且指向 B.prototype，而B.prototype被设置为一个通过new A()创建出来的对象
* 在该对象中依然没有 到 name 属性，于是请求被继续委托给这个对象构造器的原型 A.prototype
* 在对象 A.prototype 中 到了 name 属性，并返回它的值


##### 原型继承的未来

ECMAScript 6 带来了新的 Class 语法，这让 JavaScript 看起来像是一门基于类的语言， 但其后仍是通过**原型机制**来创建对象
。
```javascript
// 父类
function Animal(name) {
  this.name = name;
}
Animal.prototype.getName = function() {
  return this.name;
};
// 子类继承
function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.speak = function() {
  return "woof";
};

var dog = new Dog("Scamp");
console.log(dog.getName() + ' says ' + dog.speak());
//  ES6中的写法
class Animal {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
class Dog extends Animal {
  constructor(name) {
    super(name);
  }
  speak() {
    return "woof";
  }
}
var dog = new Dog("Scamp");
console.log(dog.getName() + ' says ' + dog.speak());
```
