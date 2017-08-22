// var obj = [1,2,3,4,5,6]
// var obj = {
//     a: 'sd'
// }
// console.log(obj)
// console.log(Object.prototype.toString.call(obj))
// console.log(typeof obj)
// // 模拟数组的push方法
// function ArrayNew () {
//     this.length = arguments.length
//     this.arr = []
//     if (arguments.length > 1) {
//         for (var i = 0; i < arguments.length; i++) {
//             var element = arguments[i];
//             this.arr[i] = element
//         }
//     } else if (arguments.length ===1) {
//         if (Object.prototype.toString.call(arguments[0]) === '[object Number]' && /^\d+$/.test(arguments[0])) {
//             for (var i = 0; i < arguments[0]; i++) {
//                 var element
//                 this.arr[i] = element
//             }
//         } else {
//             throw new Error('Invalid Array arguments')
//         }
//     } else {
//         this.arr = []
//     }
//     return this.arr
// }

// ArrayNew.prototype.push = function (ele) {
//     var arr = this.arr
//     this.arr[this.length] = ele
// } 
// ArrayNew.prototype.unshift = function () {
//     if (arguments.length === 1) {
//         var arr = this.arr
//         for (var i = arr.length; i > 0; --i) {
//             arr[i] = arr[i-1];
//         }
//         arr[0] = arguments[0]
//         this.arr = arr
//     } else if (arguments.length === 2) {
//         var arr = this.arr
//         var len = arr.length
//         for (var i = arr.length; i > 0; --i) {
//             arr[i] = arr[i-1];
//         }
//         arr[0] = arguments[0]
//         this.arr = arr
//     }
// }   

// var newArr = new ArrayNew(1,2,3)
// console.log(newArr)

Function.prototype.before = function (beforeFn){
    var _self = this
    return function () {
        console.log('f---f' + this)
        console.log('d---d'+arguments)
        beforeFn.apply(this, arguments)
        return _self.apply(this, arguments)
    }
}

var func = function () {
    console.log('2')
}
func = func.before(function () {
    console.log('1')
})
func()