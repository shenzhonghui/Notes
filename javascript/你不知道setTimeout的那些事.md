
##  你不知道的setTimeout的那些事
---
原文地址： http://web.jobbole.com/89878/

参考阮一峰：http://javascript.ruanyifeng.com/advanced/single-thread.html

### javascript 运行机制问题

javascript是单线程模型，JavaScript只在一个线程上运行。也就是说，JavaScript同时只能执行一个任务，其他任务都必须在后面排队等待。

为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。

单线程模型带来了一些问题，主要是新的任务被加在队列的尾部，只有前面的所有任务运行结束，才会轮到它执行。如果有一个任务特别耗时，后面的任务都会停在那里等待，造成浏览器失去响应，又称“假死”。为了避免“假死”，当某个操作在一定时间后仍无法结束，浏览器就会跳出提示框，询问用户是否要强行停止脚本运行。

如果排队是因为计算量大，CPU忙不过来，倒也算了，但是很多时候CPU是闲着的，因为IO设备（输入输出设备）很慢（比如Ajax操作从网络读取数据），不得不等着结果出来，再往下执行。JavaScript语言的设计者意识到，这时CPU完全可以不管IO设备，**挂起处于等待中的任务**，先运行排在后面的任务。等到IO设备返回了结果，再回过头，把挂起的任务继续执行下去。这种机制就是JavaScript内部采用的Event Loop机制。

### 消息队列

JavaScript运行时，除了一个运行线程，引擎还提供一个消息队列（message queue），里面是各种需要当前程序处理的消息。新的消息进入队列的时候，会自动排在队列的尾端。

运行线程只要发现消息队列不为空，就会取出排在第一位的那个消息，执行它对应的回调函数。等到执行完，再取出排在第二位的消息，不断循环，直到消息队列变空为止。

另一种情况是setTimeout会在指定时间向消息队列添加一条消息。如果消息队列之中，此时没有其他消息，这条消息会立即得到处理；否则，这条消息会不得不等到其他消息处理完，才会得到处理。因此，setTimeout指定的执行时间，只是一个最早可能发生的时间，并不能保证一定会在那个时间发生。


### 定时器

JavaScript提供定时执行代码的功能，叫做定时器（timer），主要由setTimeout()和setInterval()这两个函数来完成。它们向任务队列添加定时任务。

1 setTimeout()

```JavaScript
var timerId = setTimeout(func|code, delay)
```
上面代码中，setTimeout函数接受两个参数，第一个参数func|code是将要推迟执行的函数名或者一段代码，第二个参数delay是推迟执行的毫秒数。

```JavaScript
console.log(1);
setTimeout('console.log(2)',1000);
console.log(3);
```
上面代码的输出结果就是1，3，2，因为setTimeout指定第二行语句推迟1000毫秒再执行。

需要注意的是，推迟执行的代码必须以字符串的形式，放入setTimeout，因为引擎内部使用eval函数，将字符串转为代码。如果推迟执行的是函数，则可以直接将函数名，放入setTimeout。一方面eval函数有安全顾虑，另一方面为了便于JavaScript引擎优化代码，setTimeout方法一般总是采用函数名的形式，就像下面这样。

```JavaScript
function f(){
  console.log(2);
}

setTimeout(f,1000);

// 或者

setTimeout(function (){console.log(2)},1000);
```
如果省略第二个参数，则该参数默认为0

除了前两个参数，setTimeout还允许添加更多的参数。它们将被传入推迟执行的函数（回调函数）。

```javascript
setTimeout(function(a,b){
  console.log(a+b);
},1000,1,1);
```
HTML 5标准规定，setTimeout的最短时间间隔是4毫秒。为了节电，对于那些不处于当前窗口的页面，浏览器会将时间间隔扩大到1000毫秒。另外，如果笔记本电脑处于电池供电状态，Chrome和IE 9以上的版本，会将时间间隔切换到系统定时器，大约是15.6毫秒。
