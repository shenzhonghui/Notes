### 深入理解js中的对象

参考资料：

* [拥抱原型面向对象编程](https://www.ibm.com/developerworks/cn/web/wa-protoop/)

我们知道JavaScript是一门动态类型语言，所谓动态类型语言就是变量的类型是不固定的，我们给一个变量赋值的时候，不需要考虑它的类型。

JavaScript中的一切皆是对象。

### 对象的多态

“多态”一词源于希腊文polymorphism， 拆开来看是 poly(复数)+ morph(形态)+ ism，
从字面上我们可以理解为复数形态。

多态的实际意义是:同一操作作用于不同的对象上面，可以产生不同的解释和不同的执行结果。换句话说，给不同的对象发送同一个消息的时候，这些对象会根据这个消息分别给出不同的反馈。

多态背后的思想是将“做什么”和“谁去做以及怎样去做”分离开来，也就是将“不变的事物 ”与 “可能改变的事物”分离开来。

### 通过继承实现多态效果

使用继承来得到多态效果，是让对象表现出多态性的最常用手段。继承通常包括实现继承和接口继承。

#### 接口继承

```java
public abstract class Animal {
    abstract void makeSound(); // 抽象方法
}

public class Chicken extends Animal {
    public void makeSound () {
        System.out.println('咯咯咯')
    }
}

public class Duck extends Animal {
    public void makeSound () {
        System.out.println('嘎嘎嘎')
    }
}

Animal duck = new Duck();
Animal chicken = new Chicken();

// 现在 下的就是让 AnimalSound 类的 makeSound 方法接  Animal 类型的参数，而不是具 的 Duck 类型或者 Chicken 类型:
public class AnimalSound () {
    public void makeSound (Animal animal) {  // 接受Animal 类型的参数
        animal.makeSound()
    }
}

public class Test {
    public static void main(String args[]) {
        AnimalSound animalSound = new AnimalSound();
        Animal duck = new Duck();
        Animal chicken = new Chicken();
        animalSound.makeSound(duck);
        animalSound.makeSound(chicken)
    }
}
```
Javscript 的多态性是与生俱来的。JavaScript 作为一门动态类型语言，它在编译时没有类型检查的过程，既没有检查创建的对象类型， 没有检查传递的参数类型。

### 原型模式和基于原型继承的javascript 对象系统

如果我们想创建一个对象:

* 一种方法是先指定它的类型，然后通过类来创建这个对象

* 一种方式是我们不关心对象的具体类型，而是找到一个对象，通过克隆的方式创建一个一模一样的对象。

面向对象系统中有两种创建对象的方式：

#### 第一种： 以类为中心的面向对象

在以类为中心的面向对象编程语言中，类与对象的关系可以想象成铸模和铸件的关系， 对象总是从类中创建出来的。


#### 第二种: 原型编程的思想

类并不是必须的，对象未必需要从类中创建出来，一个对象是通过克隆另外一个对象所得到的。

这就是原型模式。原型模式不单是一种设计模式，也被称为一种编程泛型。

原型模式的关键，是该语言是否提供了clone方法。ES5中提供了Object.create方法，可以克隆对象。

Object.create(proto,[propertiesobject]):创建一个拥有指定原型和若干个指定属性的对象。

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
console.log(clonePlane);

// 在不支持Object.create 方法的浏览器中，则可以使用以下代码:
Object.create = Object.create || function(obj){
    var F = function(){};
    F.prototype = obj;
    return new F();
} 
```
### 继承

* 构造函数继承(pseudo-classical模式)

```javascript
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.r = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
};


function Point3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}
 
Point3D.prototype = new Point(); // 继承 Point
 
Point3D.prototype.r = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
};
```


* 使用 Object.create 继承

```javascript
var point = {
    x: 1,
    y: 2,
    r: function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
};
var point3D = Object.create(point);
point3D.z = 3;
point3D.r = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
};

```

上述两种继承，原型和 pseudo-classical 模式都有的一个缺点，它们不会提供任何成员隐私。有时候成员隐私无关紧要，但有时候却很重要。

* 函数继承模式

```javascript
var point = function(spec) {
    var that = {};
 
    that.getTimesSet = function() {
        return timesSet;
    };
 
    that.getX = function() {
        return spec.x;
    };
 
    that.setX = function(val) {
        spec.x = val;
    };
 
    that.getY = function() {
        return spec.y;
    };
 
    that.setY = function(val) {
        spec.y = val;
    };
 
    return that;
};
 
var point3D = function(spec) {
    var that = point(spec);
 
    that.getZ = function() {
        return spec.z;
    };
 
    that.setZ = function(val) {
        spec.z = val;
    };
 
    return that;
};
// 使用一个构造器来生成您的代码，并在其中定义私有成员，通过将一个 spec 传递给构造器来创建实例

var p = point({ x: 3, y: 4 });
p.getX();  // => 3
p.setX(5);
 
var p2 = point3D({ x: 1, y: 4, z: 2 });
p.getZ();  // => 2
p.setZ(3);
```

####  理解原型链中的__proto__属性

JavaScript 中的根对象是 Object.prototype 对象。Object.prototype 对象是一个空的 对象.Object.prototype 的原型是 null

*  问题1： 为什么要用new操作符和函数构造器(构造函数)？
为了使 JavaScript 看起来像是 Java 代码，设计人员提供了一些构造函数，这在典型语言中是必需的，但在原型语言中通常是不必要的开销。
```javascript
function Point(x, y) {
    this.x = x;
    this.y = y;
}
var p = new Point(3, 4);
p.x // => 3
```
您可以使用 new 关键字来创建对象，这类似于Java代码
在这里 Point 并不是类，而是函数构造器，JavaScript 的函数既可以作为普通函数被调用， 也可以作为构造器被调用。当使用 new 运算符来调用函数时，此时的函数就是一个构造器。

*  问题2： new 运算的过程是怎么样的?

在 Chrome 和 Firefox 等向外暴露了对象__proto__属性的浏览器下，我们可以通过下面这段代 码来理解 new  算的过程:

```javascript

function Person( name ){ 
    this.name = name;
};
Person.prototype.getName = function(){ 
    return this.name;
};

var objectFactory = function () {
    var obj = new Object(),
    Constructor = [].shift.call( arguments );
    obj.__proto__ = Constructor.prototype; // 指向正确的原型
    var ret = Constructor.apply(obj, arguments); // 借用外部传入的构造器给obj设置属性
    return typeof ret === 'object' ? ret : obj;// 确保构造器总是会返回一个对象
}
var a = objectFactory( Person, 'sven' );
console.log( a.name ); //   :sven
console.log( a.getName() ); //   :sven
console.log( Object.getPrototypeOf( a ) === Person.prototype ); // 输出: true

我们看到，分别调用下面两 代码产生了一样的结果:
var a = objectFactory( A, 'sven' ); 
var a = new A( 'sven' );
```
JavaScript 给对象提供了一个名为__proto__的隐藏属性，某个对象的__proto__属性默认会指指向它的构造器的原型对象，即{Constructor}.prototype。


### this、call、apply的使用

* 作为对象的方法调用， this指向该对象

* 作为普通函数调用，this指向window对象，ES5规定，严格模式下，this指向undefined

* 构造器调用，当用new运算符构造函数时，该函数总是会返回一个对象，通常情况下，构造器里的 this 就指向返回的这个对象。
(1) 但用 new 调用构造器时，还要注意一个问题，如果构造器显式地返回了一个 object 类型的对
象，那么此次运算结果最终会返回这个对象，而不是我们之前期待的this:

```javascript

var MyClass = function () {
    this.name = 'sven';
    return { // 显式的返回一个对象
        name: 'anne' 
    }
};
var obj = new MyClass();
console.log(obj.name); //   :anne

```
(2) 如果构造器不显式地返回任何数据，或者是返回一个非对象类型的数据，就不会造成上述问题:

```javascript
var MyClass = function(){
    this.name = 'sven'
    return 'anne'; // 返回string类型
};
var obj = new MyClass();
console.log(obj.name); // 输出:sven
```

*  Function.prototype.call   Function.prototype.apply调用

跟普通的函数调用相比，用 Function.prototype.call 或 Function.prototype.apply 可以动态地改变传入函数的this:
```javascript
var obj1 = {
    name: 'sven',
    getName: function () {
        return this.name
    }
}

var obj2 = {
    name: 'anne'
}

console.log(obj1.getName()); //输出: sevn
console.log(obj1.getName.call(obj2))
```







