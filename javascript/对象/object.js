function Person( name ){ 
    this.name = name;
};
Person.prototype.getName = function(){ 
    return this.name;
};

var objectFactory = function () {
    var obj = new Object(),
    Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    var ret = Constructor.apply(obj, arguments);
    return typeof ret === 'object' ? ret : obj;
}

var a = objectFactory(Person, 'sven');

function Person (num) {
    this.num = num;
}

Person.prototype.add = function (a) {
    this.num +=a
    return this
}
var obj = new Person(1)
console.log(obj.add(2).add(3).add(4).add(5))
console.log(obj.add(5))

var MyClass = function () {
    this.name = 'sven';
    return { // 显式的返回一个对象
        name: 'anne' 
    }
};
var obj = new MyClass();
console.log(obj)
console.log(obj.name); //   :anne